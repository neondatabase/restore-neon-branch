// This script restores the database to the specified timestamp. It first creates a branch without an endpoint.
//  We then re-assign the endpoint to the new branch and set it as the primary branch.
// This will restore the database to the specified timestamp while having the same connection string.
import { createApiClient } from '@neondatabase/api-client';

const NEON_API_KEY = ''; //you can generate one by going to [account settings > developer settings > generate new API key](https://console.neon.tech/app/settings/api-keys).
const NEON_PROJECT_ID = ''; //  you can find it in your project settings.
const ENDPOINT_ID = ''; //The ID of the compute endpoint you want to keep - you can find it by navigating to "Branches" and selecting the branch from the list.

const TIMESTAMP = '2023-07-23T14:05:53.000Z'; // You can use https://www.timestamp-converter.com/ to get the ISO 8601 format

const main = async () => {
  try {
    const neon = createApiClient({
      apiKey: NEON_API_KEY,
    });

    // create a new branch without an endpoint
    const newBranch = await neon.createProjectBranch(NEON_PROJECT_ID, {
      branch: {
        parent_timestamp: TIMESTAMP,
      },
    });

    const branchId = newBranch.data.branch.id;

    // update endpoint to point to the new branch
    await neon.updateProjectEndpoint(NEON_PROJECT_ID, ENDPOINT_ID, {
      endpoint: { branch_id: branchId },
    });

    // set the new branch as the primary branch
    await neon.setPrimaryProjectBranch(NEON_PROJECT_ID, branchId);

    console.log('Branch restored successfully!');
  } catch (error) {
    console.log('Something went wrong', error);
  }
};

main();
