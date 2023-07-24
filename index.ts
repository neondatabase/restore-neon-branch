// This script restores the database to the specified timestamp. It first creates a branch without an endpoint.
//  We then re-assign the endpoint to the new branch and set it as the primary branch.
// This will restore the database to the specified timestamp while having the same connection string.
import fetch from 'node-fetch';

const NEON_API_URL = 'https://console.neon.tech/api/v2';

const NEON_API_KEY = ''; //you can generate one by going to [account settings > developer settings > generate new API key](https://console.neon.tech/app/settings/api-keys).
const NEON_PROJECT_ID = ''; //  you can find it in your project settings.
const ENDPOINT_ID = ''; //The ID of the branch containing the compute endpoint you want to keep - you can find it by navigating to "Branches" and selecting the branch from the list.

const TIMESTAMP = '2023-07-23T14:05:53.000Z'; // You can use https://www.timestamp-converter.com/ to get the ISO 8601 format

const headers = {
  accept: 'application/json',
  'content-type': 'application/json',
  authorization: `Bearer ${NEON_API_KEY}`,
};

const main = async () => {
  try {
    const newBranch = await fetch(
      `${NEON_API_URL}/projects/${NEON_PROJECT_ID}/branches`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ branch: { parent_timestamp: TIMESTAMP } }),
      }
    ).then((res) => res.json());

    // update endpoint to point to the new branch
    await fetch(
      `${NEON_API_URL}/projects/${NEON_PROJECT_ID}/endpoints/${ENDPOINT_ID}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ endpoint: { branch_id: newBranch.branch.id } }),
      }
    );

    // set the new branch as the primary branch
    await fetch(
      `${NEON_API_URL}/projects/${NEON_PROJECT_ID}/branches/${newBranch.branch.id}/set_as_primary`,
      {
        method: 'POST',
        headers,
      }
    );

    console.log('Branch restored successfully!');
  } catch (error) {
    console.log('Something went wrong', error);
  }
};

main();
