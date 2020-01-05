import { SqlQueriesResolver } from './types';

export default (isDatabaseRequest = true): SqlQueriesResolver => {
    const source: string[] = [];
    let pendingJobs = 0;

    const add = (sqlQuery: string) => {
        source.push(
            sqlQuery
                .replace(/\n/g, ' ')
                .replace(/\t/g, ' ')
                .replace(/\s{2,}/g, ' ')
        );

        ++pendingJobs;
        return () => {
            --pendingJobs;
        };
    };

    const getAll = () => {
        return isDatabaseRequest
            ? new Promise<string[]>(resolve => {
                  const interval = setInterval(() => {
                      if (pendingJobs === 0) {
                          clearInterval(interval);
                          resolve(source);
                      }
                  }, 100);
              })
            : Promise.resolve([
                  'The application is using in-memory repositories; no sql queries were used'
              ]);
    };

    return {
        add,
        getAll
    };
};
