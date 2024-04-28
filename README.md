# E-commerce Website

This README outlines the setup instructions and functionalities of the e-commerce platform intended for both buyers and sellers.

## Introduction

This e-commerce website provides a marketplace for buyers to browse and purchase products and for sellers to list and manage their products.

## Technology Stack

- **Vite with TypeScript**: Used for front-end development to ensure a responsive and modern interface.
- **JSON Server**: Serves as a mock database for simulating backend functionalities during development.

## Features

### General

- **User Registration and Login**: Allows users to register and login as either buyers or sellers.

### For Buyers

- **Browse Products**: View a catalog of available products.
- **Shopping Cart Management**: Add products to a shopping cart and manage them.
- **Checkout Process**: Complete purchases through a checkout interface.

### For Sellers

- **Product Listing Management**: Add, edit, and manage product details (name, price, description, image).
- **Sales Data**: Access sales analytics for products listed.

## System Architecture

- **Front-end**: Built using Vite and TypeScript.
- **Back-end**: Utilizes JSON Server to emulate database interactions.

## Detailed Requirements

### User Authentication

- Registration fields include username, email address, password, and user role (buyer or seller).

### Buyer Features

- View and manage a personal shopping cart.
- Complete purchases through a streamlined checkout system.

### Seller Features

- Manage product listings including additions, edits, and deletions.
- View detailed sales analytics for individual products.

### Multiple Users

- Supports multiple buyer and seller accounts operating concurrently with unique usernames and email addresses.

## JSON Server

- Acts as a storage point for user and product data in a structured JSON format.

## Getting Started

### Prerequisites

- A computer with internet access.
- A code editor (e.g., VS Code).

### Setup Instructions

1. **Clone the Project**:
   Open your terminal and execute:
   ```bash
   git clone <URL>
2. **Navigate to the Project Directory**:
    ```bash
    cd team-4-ecommerce-project
3. **Install Dependencies**:
    ```bash
    npm install
4. **Start the Development Server**:
    ```bash
    npm run dev
5. **Simulate a Backend Server**:
    In a new terminal window, execute:
    ```bash
    json-server --watch ./database/data.json --port 3001
    
    This starts your JSON Server on port 3001, simulating backend functionalities.
