import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";
import fetch from "cross-fetch";
import { createWriteStream } from "fs";
import * as _ from "lodash";

// import { useQuery, gql, NetworkStatus } from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/schmackofant/polymorphs-nft",
    fetch,
  }),
  defaultOptions: {
    query: {
      fetchPolicy: "no-cache",
    },
  },
});

const SCRIPT = gql`
  query manyTokens($lastID: String) {
    tokens(first: 1000, where: { id_gt: $lastID }) {
      id
      owner {
        id
      }
    }
  }
`;

async function getData() {
  const totalTokens = 9999;
  let lastID = 0;
  let total = 0;
  let users = [];
  while (lastID < totalTokens) {
    const { data } = await client.query({
      query: SCRIPT,
      variables: { lastID: String(lastID) },
    });

    data.tokens.forEach((token) => {
      users.push(token.owner.id);
      total++;
      lastID = token.id;
    });
  }
  const r = _.uniq(users);
  console.log("Total Users: ", r.length);
  console.log("Total Tokens:", total);
  return r;
}

async function saveFile(users: any[]) {
  //write file

  var file = createWriteStream("users.txt");
  file.on("error", function (err) {
    /* error handling */
  });
  users.forEach(function (v) {
    file.write(v + "\n");
  });
  file.end();
}

async function main() {
  const users = await getData();

  saveFile(users);
}

main();
