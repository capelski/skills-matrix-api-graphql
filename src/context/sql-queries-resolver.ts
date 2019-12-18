import { SqlQueriesResolver } from './types';

export default (): SqlQueriesResolver => {
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
        return new Promise<string[]>(resolve => {
            const interval = setInterval(() => {
                if (pendingJobs === 0) {
                    clearInterval(interval);
                    resolve(source);
                }
            }, 100);
        });
    };

    return {
        add,
        getAll
    };
};
