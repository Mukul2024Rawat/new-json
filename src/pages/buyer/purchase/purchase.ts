let purchaseUserData: string = localStorage.getItem("activeBuyerUser") || "";
let purchaseUserInfo = JSON.parse(purchaseUserData);
const purchaseUserId = purchaseUserInfo.ActiveUserId;
let arrPurchaseItem: {
  buyerProduct: string;
  brand: string;
  price: string;
  offerPrice: string;
  quantity: number;
  productId: string;
  id: string;
}[] = [];

fetch(`http://localhost:3000/purchase/?buyerId=${purchaseUserId}`)
  .then((response) => response.json())
  .then((products) => (arrPurchaseItem = products))
  .then(() => {
    let list = document.getElementById("purchase_list");
    if (!list) return;
    list.innerHTML = ""; // Clear previous items
    for (let i = 0; i < arrPurchaseItem.length; ++i) {
      let box = document.createElement("div");
      box.classList.add("box"); // Add CSS class for styling
      box.innerHTML = `
            <p class="user_name">Product Name: ${arrPurchaseItem[i].buyerProduct}</p>
            <p> Brand: ${arrPurchaseItem[i].brand}</p>
            <p> Price: ${arrPurchaseItem[i].price}</p>
            <p> Offer-Price: ${arrPurchaseItem[i].offerPrice}</p>
            <p> Quantity: ${arrPurchaseItem[i].quantity}</p>
            <p> Product ID: ${arrPurchaseItem[i].productId}</p>`; // Display product ID

      list.appendChild(box);
    }
  })
  .catch((error) => {
    console.log(error);
  });
