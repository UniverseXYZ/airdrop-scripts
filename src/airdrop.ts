// import * as _ from "lodash";
import bidDrop from "./airdrop/bid-drop.json";
import discordDrop from "./airdrop/discord-drop.json";
import polyDrop from "./airdrop/polymorph-drop.json";
import { ethers, BigNumber } from "ethers";
import { createWriteStream } from "fs";

type Account = {
  account: string;
  amount: BigNumber;
};

interface HashTable<T> {
  [key: string]: T;
}

function computeAidrop() {
  var accounts = new Map();
  let total: BigNumber = BigNumber.from(0);
  discordDrop.forEach((user) => {
    let value = BigNumber.from(0);
    if (accounts.has(ethers.utils.getAddress(user.account))) {
      value = accounts.get(ethers.utils.getAddress(user.account));
    }
    accounts.set(ethers.utils.getAddress(user.account), value.add(user.amount));
    total = total.add(BigNumber.from(user.amount));
  });
  bidDrop.forEach((user) => {
    let value = BigNumber.from(0);
    if (accounts.has(ethers.utils.getAddress(user.account))) {
      value = accounts.get(ethers.utils.getAddress(user.account));
    }
    accounts.set(ethers.utils.getAddress(user.account), value.add(user.amount));
    total = total.add(BigNumber.from(user.amount));
  });
  polyDrop.forEach((user) => {
    let value = BigNumber.from(0);
    if (accounts.has(ethers.utils.getAddress(user.account))) {
      value = accounts.get(ethers.utils.getAddress(user.account));
    }
    accounts.set(ethers.utils.getAddress(user.account), value.add(user.amount));
    total = total.add(BigNumber.from(user.amount));
  });
  console.log(total.toString());
  return accounts;
}

function saveFile(users: Map<string, BigNumber>) {
  const data = JSON.stringify(users);

  var file = createWriteStream("airdrop.json");
  file.on("error", function (err) {
    /* error handling */
  });
  file.write("[");
  users.forEach((value, key) => {
    file.write(
      `{"address": "${key}", "earnings": "${value.toString()}"},` + "\n"
    );
  });
  file.write("]");
  file.end();
  console.log("File Saved");
}

function main() {
  const accounts = computeAidrop();

  saveFile(accounts);
}

main();
