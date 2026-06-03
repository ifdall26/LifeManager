let transactions = Database.get("transactions");

let wallets = Database.get("wallets");

function saveWallets() {
  Database.save("wallets", wallets);

  renderWallets();

  renderWalletOptions();

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

renderWallets();

renderWalletOptions();

renderTransactions();
