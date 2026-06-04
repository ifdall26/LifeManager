let transactions = Database.get("transactions");

let wallets = Database.get("wallets");

function saveWallets() {
  Database.save("wallets", wallets);

  renderWallets();

  renderWalletOptions();

  renderTransferOptions();

  updateDashboardBalance();
}

function renderWallets() {
  const walletList = document.getElementById("walletList");

  if (!walletList) return;

  walletList.innerHTML = "";

  wallets.forEach((wallet) => {
    const div = document.createElement("div");

    div.className = "wallet-card";

    div.innerHTML = `

            <div>

                <h3>
                ${wallet.name}
                </h3>

                <div class="wallet-balance">

                    Rp ${wallet.balance.toLocaleString()}

                </div>

            </div>

            <button
            onclick="deleteWallet(${wallet.id})">

            Hapus

            </button>

        `;

    walletList.appendChild(div);
  });
}

function renderWalletOptions() {
  const select = document.getElementById("transactionWallet");

  if (!select) return;

  select.innerHTML = "";

  wallets.forEach((wallet) => {
    select.innerHTML += `

            <option
            value="${wallet.id}">

            ${wallet.name}

            </option>

        `;
  });
}

function addWallet() {
  const name = document.getElementById("walletName").value;

  const balance = Number(document.getElementById("walletBalance").value);

  if (!name) {
    alert("Masukkan nama wallet");

    return;
  }

  wallets.push({
    id: Date.now(),

    name: name,

    balance: balance || 0,
  });

  saveWallets();

  document.getElementById("walletName").value = "";

  document.getElementById("walletBalance").value = "";
}

function deleteWallet(id) {
  wallets = wallets.filter((wallet) => wallet.id !== id);

  saveWallets();
}
function saveTransactions() {
  Database.save("transactions", transactions);

  renderTransactions();
}

function addTransaction() {
  const walletId = Number(document.getElementById("transactionWallet").value);

  const type = document.getElementById("transactionType").value;

  const amount = Number(document.getElementById("transactionAmount").value);

  const note = document.getElementById("transactionNote").value;

  if (amount <= 0) {
    alert("Nominal harus lebih besar dari 0");

    return;
  }

  const wallet = wallets.find((w) => w.id === walletId);

  if (!wallet) return;

  if (type === "income") {
    wallet.balance += amount;
  } else {
    if (wallet.balance < amount) {
      alert("Saldo tidak cukup");

      return;
    }

    wallet.balance -= amount;
  }

  transactions.unshift({
    id: Date.now(),

    wallet: wallet.name,

    type,

    amount,

    note,

    date: new Date().toLocaleString(),
  });

  saveWallets();

  saveTransactions();
}

function renderTransactions() {
  const container = document.getElementById("transactionList");

  if (!container) return;

  container.innerHTML = "";

  transactions.forEach((item) => {
    const div = document.createElement("div");

    div.className = `transaction-card ${item.type}`;

    div.innerHTML = `

            <strong>

            ${item.wallet}

            </strong>

            <br>

            ${item.note}

            <br>

            Rp ${item.amount.toLocaleString()}

            <br>

            ${item.date}

        `;

    container.appendChild(div);
  });
}

document
  .getElementById("addTransactionBtn")
  ?.addEventListener("click", addTransaction);

document.getElementById("addWalletBtn")?.addEventListener("click", addWallet);

function renderTransferOptions() {
  const from = document.getElementById("transferFrom");

  const to = document.getElementById("transferTo");

  if (!from || !to) {
    return;
  }

  from.innerHTML = "";
  to.innerHTML = "";

  wallets.forEach((wallet) => {
    from.innerHTML += `
            <option
            value="${wallet.id}">
            ${wallet.name}
            </option>
        `;

    to.innerHTML += `
            <option
            value="${wallet.id}">
            ${wallet.name}
            </option>
        `;
  });
}

function transferBalance() {
  const fromId = Number(document.getElementById("transferFrom").value);

  const toId = Number(document.getElementById("transferTo").value);

  const amount = Number(document.getElementById("transferAmount").value);

  if (fromId === toId) {
    alert("Wallet asal dan tujuan tidak boleh sama");

    return;
  }

  const fromWallet = wallets.find((w) => w.id === fromId);

  const toWallet = wallets.find((w) => w.id === toId);

  if (!fromWallet || !toWallet) {
    return;
  }

  if (amount <= 0) {
    alert("Nominal tidak valid");

    return;
  }

  if (fromWallet.balance < amount) {
    alert("Saldo tidak cukup");

    return;
  }

  fromWallet.balance -= amount;

  toWallet.balance += amount;

  transactions.unshift({
    id: Date.now(),

    wallet: `${fromWallet.name} → ${toWallet.name}`,

    type: "transfer",

    amount,

    note: "Transfer Wallet",

    date: new Date().toLocaleString(),
  });

  saveWallets();

  saveTransactions();
}

document
  .getElementById("transferBtn")
  ?.addEventListener("click", transferBalance);

renderWallets();

renderWalletOptions();

renderTransferOptions();

renderTransactions();
