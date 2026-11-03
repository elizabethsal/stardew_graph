import {useRef} from "react";

export function APITester() {
    const responseInputRef = useRef<HTMLTextAreaElement>(null);

    interface RecordData {
        pageid: number;
        title: string;
    }

    interface WikiResponse {
        query: {
            allpages: RecordData[];
        };
        continue?: {
            apcontinue: string;
            continue: string;
        };
    }

    async function getAll(): Promise<RecordData[]> {
        let allRecords: RecordData[] = [];
        let apcontinue: string | undefined;

        try {
            do {
                const params = new URLSearchParams({
                    action: 'query',
                    list: 'allpages',
                    aplimit: '500',
                    format: 'json',
                    formatversion: '2',
                    origin: '*',
                });

                if (apcontinue) {
                    params.set('apcontinue', apcontinue);
                }

                const url =
                    `https://stardewvalleywiki.com/mediawiki/api.php?${params}`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(
                        `HTTP Error: ${response.status}`
                    );
                }

                const data: WikiResponse = await response.json();

                allRecords.push(...data.query.allpages);

                apcontinue = data.continue?.apcontinue;

                console.log(
                    `Downloaded: ${allRecords.length} pages`
                );

            } while (apcontinue);

        } catch (error) {
            console.error('Download error:', error);
        }

        console.log(
            `Download completed: ${allRecords.length} pages`
        );

        return allRecords;
    }

    return (
        <div className="api-tester">
            <button onClick={getAll} type="submit" className="send-button">
                Get All topics
            </button>
            <textarea
                ref={responseInputRef}
                readOnly
                placeholder="Response will appear here..."
                className="response-area"
            />
        </div>
    );
}
