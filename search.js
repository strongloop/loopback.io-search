/**
 *
 * main() will be run when you invoke this action
 *
 * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
 *
 * @return The output of this action, which must be a JSON object.
 *
 */

// This is pre-installed on IBM Cloud for Node 8
const DiscoveryV1 = require('watson-developer-cloud/discovery/v1');

// Main function to run. Params includes Credentials and query params
function main(params) {
  if (!params.q) {
    return { status: false, msg: 'Missing a search term.' };
  }

  // Initialize Watson Discovery
  const discovery = new DiscoveryV1({
    version: '2018-03-05',
    username: params.discovery_username,
    password: params.discovery_password
  });

  return new Promise(function(resolve, reject) {
    // Get List of Watson Discovery Environments
    discovery.listEnvironments({}, (envErr, envData) => {
      if (envErr || !envData.environments) {
        return resolve({
          status: false,
          msg: 'Search error. Failed to get environments for Discovery.'
        });
      }

      // Get environment ID. Filter out `system` id.
      let envID;
      envData.environments.forEach(env => {
        if (env.environment_id !== 'system') {
          envID = env.environment_id;
        }
      });

      // Get List of Watson Discovery Collections in Environment
      discovery.listCollections({ environment_id: envID }, function(
        collErr,
        collData
      ) {
        if (collErr || !collData.collections) {
          return resolve({
            status: false,
            msg: 'Search error. Failed to get collections for Discovery.'
          });
        }

        // Sort the collections so we use the oldest collection if multiple exist.
        let collectionID;
        if (collData.collections.length > 1) {
          collData.collections.sort(function(a, b) {
            if (a.created < b.created) {
              return -1;
            }
            if (a.created > b.created) {
              return 1;
            }
            return 0;
          });
        }
        collectionID = collData.collections[0].collection_id;

        // Watson Discovery Query Object
        const data = {
          environment_id: envID,
          collection_id: collectionID,
          natural_language_query: params.q,
          highlight: true,
          return_fields: ['metadata']
        };

        // Filter based on sidebar metadata if present.
        // Include Contribute and Community Sidebars as default as well
        // as the English version of docs (if a different language sidebar) is set.
        if (params.sidebar) {
          const sidebars = ['contrib_sidebar', 'community_sidebar'];
          if (params.sidebar.split('_').length > 2) {
            sidebars.push(
              params.sidebar
                .split('_')
                .splice(1)
                .join('_')
            );
          }
          sidebars.push(params.sidebar);

          let filter;
          sidebars.map(x => {
            x = `metadata.sidebar:"${x}"`;
          });
          filter = `(${sidebars.join('|')})`;
          data.filter = filter;
        }

        // Query offset
        if (params.offset) {
          data.offset = params.offset;
        }

        // Make the query to Watson Discovery -- Return results to user.
        discovery.query(data, function(qErr, qData) {
          if (qErr) {
            return resolve({
              status: false,
              msg: 'Search error. Failed to query documents.',
              e: qErr
            });
          }

          return resolve(Object.assign({ status: true }, qData));
        });
      });
    });
  });
}
