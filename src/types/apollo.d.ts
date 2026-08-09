import "@apollo/client"

declare module "@apollo/client" {
    export namespace ApolloClient {
        export namespace DeclareDefaultOptions {
            interface WatchQuery {
                errorPolicy?: "none" | "all" | "ignore"
            }

            interface Query {
                errorPolicy?: "none" | "all" | "ignore"
            }
        }
    }
}
