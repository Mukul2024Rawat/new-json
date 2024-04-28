let buyerDataFromLocal = localStorage.getItem("activeBuyerUser") || "";
let buyerInfoFromLocal = JSON.parse(buyerDataFromLocal);
const buyerIdFromLocal = buyerInfoFromLocal.ActiveUserId;

let arrItem: {
    productName: string;
    brand: string;
    price: string;
    offerPrice: string;
    quantity: string;
    pid: string;
    id: string;
    totalPrice: number;
}[] = [];

fetch(`http://localhost:3000/cart/?buyerId=${buyerIdFromLocal}`)
    .then((response) => response.json())
    .then((products) => {
        arrItem = products.map((product: any) => ({
            ...product,
            totalPrice: parseFloat(product.offerPrice) * parseInt(product.quantity), // Calculate totalPrice as offerPrice * quantity
        }));
    })
    .then(() => {
        let list = document.getElementById("cart_list");
        for (let i = 0; i < arrItem.length; ++i) {
            let box = document.createElement("box");
            box.style.border = "2px solid black";
            box.style.maxWidth = "fit-content";
            box.innerHTML = `
            <p class="user_name">Product Name: ${arrItem[i].productName}</p>
            <p> Brand: ${arrItem[i].brand}</p>
            <p> Price: ${arrItem[i].offerPrice}</p> <!-- Display offerPrice -->
            <p> Offer-Price: ${arrItem[i].offerPrice}</p>
            <p> Quantity: ${arrItem[i].quantity}</p>
            <p> Total Price: ${arrItem[i].totalPrice}</p>
            <p> Product-Id: ${arrItem[i].pid}</p>
            <button id="delete-${arrItem[i].id}" class ="delete-btn">Delete Cart</button>
            <button id="purchase-${arrItem[i].id}" class ="purchase-btn">Purchase</button>`;
            list!.appendChild(box);

            let deleteBtn = document.querySelector(`#delete-${arrItem[i].id}`);
            deleteBtn?.addEventListener("click", () => {
                fetch(`http://localhost:3000/cart/${arrItem[i].id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                    .then((res) => res.json())
                    .then(() => {
                        alert("Product Deleted successfully");
                        location.reload();
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });

            let purchaseBtn = document.querySelector(`#purchase-${arrItem[i].id}`);
            purchaseBtn?.addEventListener("click", () => {
                fetch(`http://localhost:3000/products/${arrItem[i].pid}`)
                    .then((response) => response.json())
                    .then((product) => {
                        const newAvailableStock = parseInt(product.availableStock) - parseInt(arrItem[i].quantity);
                        if (newAvailableStock < 0) {
                            alert("Insufficient stock!");
                            return;
                        }
                        fetch(`http://localhost:3000/products/${arrItem[i].pid}`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                availableStock: newAvailableStock.toString(),
                            }),
                        })
                            .then((response) => response.json())
                            .then(() => {
                                fetch("http://localhost:3000/purchase", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        buyerId: buyerIdFromLocal,
                                        buyerProduct: arrItem[i].productName,
                                        brand: arrItem[i].brand,
                                        price: arrItem[i].offerPrice,
                                        offerPrice: arrItem[i].offerPrice,
                                        quantity: arrItem[i].quantity,
                                        productId: arrItem[i].pid,
                                    }),
                                })
                                    .then((response) => response.json())
                                    .then(() => {
                                        alert("Congratulations! Your purchase was successful. Thank you for shopping with us!");
                                        // Remove the purchased product from the cart
                                        fetch(`http://localhost:3000/cart/${arrItem[i].id}`, {
                                            method: "DELETE",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                        })
                                            .then((res) => res.json())
                                            .then(() => {
                                                // Remove the cart item from UI
                                                box.remove();
                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            });
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
        }
    });
