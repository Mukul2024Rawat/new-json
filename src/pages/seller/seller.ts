interface Product {
  id: string;
  productName: string;
  description: string;
  brand: string;
  price: string;
  offerPrice: string;
  stock: string;
  availableStock: string;
  sellerId: string;
}

let products: Product[] = [];

const renderTable = () => {
  const tableBody = document.querySelector<HTMLTableSectionElement>("#productData tbody")!;
  tableBody.innerHTML = "";
  products.forEach((product: Product) => {
    const row = tableBody.insertRow();
    row.dataset.id = product.id;
    row.innerHTML = `
      <td>${product.id}</td>
      <td class="editable" data-field="productName">${product.productName}</td>
      <td class="editable" data-field="description">${product.description}</td>
      <td class="editable" data-field="brand">${product.brand}</td>
      <td class="editable" data-field="price">${product.price}</td>
      <td class="editable" data-field="offerPrice">${product.offerPrice}</td>
      <td class="editable" data-field="stock">${product.stock}</td>
      <td class="editable" data-field="availableStock">${product.availableStock}</td>
      <td>
          <button class="edit-btn">Edit</button>
          <button class="save-btn" style="display: none;">Save</button>
          <button class="delete-btn">Delete</button>
      </td>
    `;
    const editBtn = row.querySelector(".edit-btn") as HTMLButtonElement;
    const saveBtn = row.querySelector(".save-btn") as HTMLButtonElement;
    const deleteBtn = row.querySelector(".delete-btn") as HTMLButtonElement;
    editBtn.addEventListener("click", () => {
      enableEditMode(row);
    });
    saveBtn.addEventListener("click", () => {
      saveProductData(row);
    });
    deleteBtn.addEventListener("click", () => {
      const productId = row.dataset.id;
      if (productId) {
        deleteProduct(productId);
      }
    });
  });
};

const enableEditMode = (row: HTMLTableRowElement) => {
  row.querySelectorAll(".editable").forEach((cell) => {
    const text = (cell as HTMLElement).innerText;
    const field = (cell as HTMLElement).getAttribute("data-field");
    if (field) {
      (cell as HTMLElement).innerHTML = `<input type="text" value="${text}" data-original="${text}" data-field="${field}" />`;
    }
  });
  const editBtn = row.querySelector(".edit-btn") as HTMLButtonElement;
  const saveBtn = row.querySelector(".save-btn") as HTMLButtonElement;
  editBtn.style.display = "none";
  saveBtn.style.display = "inline-block";
  saveBtn.style.margin = "5px";
  saveBtn.style.width = "52px";
};

const saveProductData = (row: HTMLTableRowElement) => {
  const productId = row.dataset.id;
  if (!productId) {
    console.error("Product ID not found for row");
    return;
  }
  const updatedProduct: Partial<Product> = {};
  row.querySelectorAll("input").forEach((input) => {
    const field = input.getAttribute("data-field");
    if (field) {
      updatedProduct[field as keyof Product] = input.value;
    }
  });

  // Validation
  if (!validateProduct(updatedProduct)) {
    alert("Validation failed. Please fill all required fields and ensure Price and Offer Price are numbers.");
    return;
  }

  let sellerData = localStorage.getItem("activeSellerUser");
  if (!sellerData) {
    console.error("Seller ID not found in local storage");
    window.location.href = "../login/login.html"; // Redirect to login page
    return;
  }
  let sellerInfo = JSON.parse(sellerData);
  const sellerId = sellerInfo.ActiveUserId;
  updatedProduct["sellerId"] = sellerId;

  fetch(`http://localhost:3000/products/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedProduct),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to save product data");
      }
    })
    .then((updatedProductData: Product) => {
      products = products.map((product) => (product.id === productId ? updatedProductData : product));
      renderTable();
    })
    .catch((error) => {
      console.error("Error saving product data:", error);
      alert("Failed to save product data. Please try again later.");
    });
};

const validateProduct = (product: Partial<Product>): boolean => {
  if (!product.productName || !product.description || !product.brand || !product.price || !product.offerPrice || !product.stock || !product.availableStock) {
    return false;
  }
  if (isNaN(Number(product.price)) || isNaN(Number(product.offerPrice)) || isNaN(Number(product.stock)) || isNaN(Number(product.availableStock))) {
    return false;
  }
  return true;
};

const deleteProduct = (productId: string) => {
  fetch(`http://localhost:3000/products/${productId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        products = products.filter((product) => product.id !== productId);
        renderTable();
      } else {
        console.error("Failed to delete product");
        alert("Failed to delete product. Please try again later.");
      }
    })
    .catch((err) => {
      console.error("Error deleting product:", err);
      alert("Failed to delete product. Please try again later.");
    });
};

const addProductRow = () => {
  const tableBody = document.querySelector<HTMLTableSectionElement>("#productData tbody")!;
  const newRow = tableBody.insertRow();
  newRow.innerHTML = `
      <td></td>
      <td class="editable" data-field="productName"><input type="text" placeholder="Product Name"></td>
      <td class="editable" data-field="description"><input type="text" placeholder="Description"></td>
      <td class="editable" data-field="brand"><input type="text" placeholder="Brand"></td>
      <td class="editable" data-field="price"><input type="text" placeholder="Price"></td>
      <td class="editable" data-field="offerPrice"><input type="text" placeholder="Offer Price"></td>
      <td class="editable" data-field="stock"><input type="text" placeholder="Stock"></td>
      <td class="editable" data-field="availableStock"><input type="text" placeholder="Available Stock"></td>
      <td>
          <button class="save-btn">Save</button>
          <button class="delete-btn">Delete</button>
      </td>
  `;
  const saveBtn = newRow.querySelector(".save-btn") as HTMLButtonElement;
  const deleteBtn = newRow.querySelector(".delete-btn") as HTMLButtonElement;
  saveBtn.addEventListener("click", () => {
    saveNewProduct(newRow);
  });
  deleteBtn.addEventListener("click", () => {
    newRow.remove();
  });
};

const saveNewProduct = (row: HTMLTableRowElement) => {
  const productNameInput = row.querySelector<HTMLInputElement>(".editable[data-field='productName'] input")!;
  const descriptionInput = row.querySelector<HTMLInputElement>(".editable[data-field='description'] input")!;
  const brandInput = row.querySelector<HTMLInputElement>(".editable[data-field='brand'] input")!;
  const priceInput = row.querySelector<HTMLInputElement>(".editable[data-field='price'] input")!;
  const offerPriceInput = row.querySelector<HTMLInputElement>(".editable[data-field='offerPrice'] input")!;
  const stockInput = row.querySelector<HTMLInputElement>(".editable[data-field='stock'] input")!;
  const availableStockInput = row.querySelector<HTMLInputElement>(".editable[data-field='availableStock'] input")!;

  const productName = productNameInput.value.trim();
  const description = descriptionInput.value.trim();
  const brand = brandInput.value.trim();
  const price = priceInput.value.trim();
  const offerPrice = offerPriceInput.value.trim();
  const stock = stockInput.value.trim();
  const availableStock = availableStockInput.value.trim();

  // Validation
  if (!productName || !description || !brand || !price || !offerPrice || !stock || !availableStock) {
    alert("All fields are required.");
    return;
  }
  if (isNaN(Number(price)) || isNaN(Number(offerPrice)) || isNaN(Number(stock)) || isNaN(Number(availableStock))) {
    alert("Price, Offer Price, Stock, and Available Stock must be numbers.");
    return;
  }

  let sellerData = localStorage.getItem("activeSellerUser");
  if (!sellerData) {
    console.error("Seller ID not found in local storage");
    window.location.href = "../login/login.html"; // Redirect to login page
    return;
  }
  let sellerInfo = JSON.parse(sellerData);
  const sellerId = sellerInfo.ActiveUserId;

  fetch('http://localhost:3000/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productName,
      description,
      brand,
      price,
      offerPrice,
      stock,
      availableStock,
      sellerId,
    }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to save new product data');
      }
      return response.json();
    })
    .then(data => {
      const cells = row.cells;
      cells[0].innerText = data.id;
      cells[1].innerText = productName;
      cells[2].innerText = description;
      cells[3].innerText = brand;
      cells[4].innerText = price;
      cells[5].innerText = offerPrice;
      cells[6].innerText = stock;
      cells[7].innerText = availableStock;
    })
    .catch(error => {
      console.error('Error saving new product:', error);
      alert("Failed to save new product. Please try again later.");
    });
};

fetch("http://localhost:3000/products")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch product data");
    }
    return response.json();
  })
  .then((data: Product[]) => {
    let sellerData = localStorage.getItem("activeSellerUser");
    if (!sellerData) {
      console.error("Seller ID not found in local storage");
      window.location.href = "../login/login.html"; // Redirect to login page
      return;
    }
    let sellerInfo = JSON.parse(sellerData);
    const sellerId = sellerInfo.ActiveUserId;
    products = data.filter(product => product.sellerId === sellerId);
    renderTable();
  })
  .catch((error) => {
    console.error("Error fetching product data:", error);
    alert("Failed to fetch product data. Please try again later.");
  });

document.body.innerHTML = `
  <nav>
    <a href="../login/login.html" id="logout-btn">Logout</a>
  </nav>
  <h1>Product Registration</h1>
  <button id="addProductBtn" class="add-btn">Add Product</button>
  <table id="productData">
    <thead>
      <tr>
        <th>ID</th>
        <th>Product Name</th>
        <th>Description</th>
        <th>Brand</th>
        <th>Price</th>
        <th>Offer Price</th>
        <th>Stock</th>
        <th>Available Stock</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
`;

const addProductBtn = document.getElementById("addProductBtn")!;
addProductBtn.addEventListener("click", addProductRow);
