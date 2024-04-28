let buyerData: string | null = localStorage.getItem("activeBuyerUser") || "";
let buyerInfo: { ActiveUserId: string } = JSON.parse(buyerData);
const buyerId: string = buyerInfo.ActiveUserId;
console.log(buyerId);

let arr: {
  id: string;
  productName: string;
  description: string;
  price: string;
  offerPrice: string;
  brand: string;
  availableStock: string;
}[] = [];

fetch("http://localhost:3000/products")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((products) => (arr = products))
  .then(() => {
    let list = document.getElementById("productList");
    if (!list) return; // Check if list is null
    for (let i = 0; i < arr.length; ++i) {
      let box = document.createElement("div");
      box.classList.add("box"); // Add box class
      box.innerHTML = `
      <p class="user_name"><b>Product-Name: ${arr[i].productName}</b></p>
      <p> Description: ${arr[i].description}</p>
      <p> Price: ${arr[i].price}</p>
      <p> Brand: ${arr[i].brand}</p>
      <p> Offer-Price: ${arr[i].offerPrice}</p>
      <p> Available Stock: ${arr[i].availableStock}</p>
      <label for="quantity-${arr[i].id}">Quantity:</label>
      <select id="quantity-${arr[i].id}">
      ${generateQuantityOptions(arr[i].availableStock)}
      </select>
      <p><button id="cart-${arr[i].id}" class="cart-btn" data-pid="${arr[i].id}">Add to Cart</button></p>`;
      list.appendChild(box);

      let cartButton = document.getElementById(`cart-${arr[i].id}`);
      if (!cartButton) continue; // Check if cartButton is null
      cartButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (!(e.target instanceof HTMLElement)) return; // Check if e.target is an HTMLElement
        let productId = e.target.dataset.pid;
        if (!productId) return; // Check if productId is null
        let product = arr.find((item) => item.id === productId);
        if (!product || parseInt(product.availableStock) <= 0) {
          alert("Sorry, this product is out of stock!");
          return;
        }
        let quantitySelect = document.getElementById(`quantity-${productId}`) as HTMLSelectElement;
        let quantity = parseInt(quantitySelect.value);
        if (isNaN(quantity) || quantity <= 0 || quantity > parseInt(product.availableStock)) {
          alert("Please select a valid quantity within the available stock range.");
          return;
        }
        let cartItem = {
          productName: `${product.productName}`,
          brand: `${product.brand}`,
          price: `${product.price}`,
          offerPrice: `${product.offerPrice}`,
          quantity: quantity,
          pid: productId,
          buyerId: buyerId,
        };
        fetch("http://localhost:3000/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cartItem),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then(() => {
            alert("Successfully added to cart");
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }
  })
  .catch((error) => {
    console.log("error ", error);
  });

function generateQuantityOptions(availableStock: string): string {
  let options = '';
  const stock = parseInt(availableStock);
  for (let i = 1; i <= stock; i++) {
    options += `<option value="${i}">${i}</option>`;
  }
  return options;
}
