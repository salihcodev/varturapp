# Nuxt.js `Vartureapp` fullstacked;;

This project is a backend for an e-commerce platform built with Nuxt.js and Prisma. It provides CRUD (Create, Read, Update, Delete) APIs for managing product categories and products, and organizes categories into a tree structure with recursive product counts. The project also includes image processing functionality to resize images upon upload.

## Overview and File Structure

```bash

.
├── prisma
│   ├── migrations
│   │   ├── 20240823014934_init
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── public
│   ├── favicon.ico
│   ├── robots.txt
│   └── uploads
│       ├── 1724501833653-test-cat.png
│       ├── 1724508551622-cat-up.png
│       ├── ........
│       └── 1724681023809-cat-up.png
├── server
│   ├── api
│   │   ├── categories
│   │   │   ├── [id].delete.ts
│   │   │   ├── [id].get.ts
│   │   │   ├── [id].put.ts
│   │   │   ├── index.get.ts
│   │   │   └── index.post.ts
│   │   ├── _hit.ts
│   │   └── products
│   │       ├── [id].delete.ts
│   │       ├── [id].get.ts
│   │       ├── [id].put.ts
│   │       ├── index.get.ts
│   │       └── index.post.ts
│   ├── middleware
│   │   ├── file_uploader.middleware.ts
│   │   └── log.middleware.ts
│   ├── tsconfig.json
│   └── utils
│       └── log-to-file.uril.ts.ts
├── pages
│   ├── categories
│   │   ├── index.vue
│   │   └── manage.vue
│   ├── index.vue
│   └── products
│       └── manage.vue
├── components
│   ├── category-form.vue
│   ├── category-node.vue
│   ├── confirmation-modal.vue
│   └── product-form.vue
├── bin
│   ├── str:dev.sh
│   └── str:docker.sh
├── logs
│   └── main.log
├── app.vue
├── docker-compose.yml
├── Dockerfile
├── pnpm-lock.yaml
├── package.json
├── nuxt.config.ts
├── README.md
└── tsconfig.json

```

## Features

- **Nuxt.js**: Utilizes the latest version of Nuxt.js for a full-stack JavaScript framework.

- **Prisma**: Integrates Prisma for database migration and ORM, using MySQL as the database.

- **Category Management**:

- CRUD operations for categories.

- Displays categories as a hierarchical tree structure.

- Shows the product count for each category, including its recursive children.

- **Product Management**:

- CRUD operations for products.

- Products are linked to categories, with the ability to select categories from a dropdown list.

- The product form displays top parent categories and allows selecting child categories dynamically.

- **Image Upload & Resizing**:

- Images are uploaded and resized locally to a standard dimension of 3200x3200 pixels.

- **API Endpoints**: Provides RESTful API endpoints for both categories and products.

- **MySQL Database**: Data storage and retrieval are managed through a MySQL database.

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (v16 or higher is recommended).

- **MySQL**: A MySQL database instance is required for data storage.

- **Docker**: Accelerated Container Application Development.

- **Postman collection**: **[Here](https://www.postman.com/universal-star-686675/workspace/tasks-env/collection/12646883-6ef39e19-0726-45b9-9c3d-fa584fd7e85c)**

### Installation

```bash

git  clone  https://github.com/salihcodev/varturapp.git

cd varturapp

```

### A Quick Start

- You can use `~/bin` directory to jump right inside the project.
  Just open the terminal, Then use one of the following scripts:

**Note** > change DATABASE_URL host to be `db` instead of `localhost` in `.env` file
if you meant to run inside docker

**Start in normal developing mode:**

```bash
./str:dev.sh
```

OR

**Start in `Docker` mode:**

note: need to have a permission **_(if asking )_**

```bash
chmod  +x  str:docker.sh
```

```bash
./str:docker.sh
```

### Available Scripts

1.  **`build`**: `"nuxt build"`

    - This script compiles and builds the Nuxt application for production. It generates the optimized files required for deployment.

```bash
pnpm build
```

2.  **`dev`**: `"nuxt dev"`

    - This script starts the Nuxt development server. It enables features like Hot Module Replacement (HMR) for a smoother development experience and serves the application in development mode.

```bash
pnpm dev
```

3.  **`generate`**: `"nuxt generate"`

    - This script generates a static version of the Nuxt application. It's used for static site generation, creating a fully static version of your site that can be deployed to static hosting services.

```bash
pnpm generate
```

4.  **`preview`**: `"nuxt preview"`

    - This script is used to preview the static build of the application after running `nuxt generate`. It serves the generated static files and allows you to preview the final build before deployment.

```bash
pnpm preview
```

5.  **`postinstall`**: `"nuxt prepare"`

    - This script runs after the dependencies are installed. It prepares the Nuxt application, typically performing tasks like building the project or running additional setup scripts.

```bash
pnpm postinstall
```

6.  **`prisma:mg`**: `"npx prisma migrate dev --name"`

    - This script is used to run Prisma migrations in development mode. It helps in applying database schema changes. The `--name` parameter is a placeholder for providing a migration name when running the script.

```bash
pnpm prisma:mg
```

7.  **`prisma:std`**: `"npx prisma studio"`

    - This script opens Prisma Studio, a graphical interface for managing your database. It allows you to view and interact with your database records through a user-friendly UI.

```bash
pnpm prisma:std
```

### **Collection Info**

- **Name**: `varturapp`

- **Description**: Postman collection for `Vartureapp` API

- **Schema**: URL to the Postman schema definition

- **Collection Link**: [View Collection](https://www.postman.com/universal-star-686675/workspace/tasks-env/collection/12646883-6ef39e19-0726-45b9-9c3d-fa584fd7e85c?action=share&source=collection_link&creator=12646883)

### **Requests**

#### **\_hit**

- **Method**: GET

- **URL**: `{{base_url}}/api/_hit`

- **Body**: None

#### **Categories**

1.  **Get All Categories**

    - **Method**: GET

    - **URL**: `{{base_url}}/api/categories`

    - **Body**: Empty (formdata mode)

    - **Response**: None

2.  **Create Category**

    - **Method**: POST

    - **URL**: `{{base_url}}/api/categories`

    - **Headers**: `Content-Type: application/json`

    - **Body**: Form-data with fields `name`, `picture` (file), `parent_id`

    - **Response**: None

3.  **Get Category by ID**

    - **Method**: GET

    - **URL**: `{{base_url}}/api/categories/10`

    - **Body**: None

4.  **Update Category by ID**

    - **Method**: PUT

    - **URL**: `{{base_url}}/api/categories/45645`

    - **Headers**: `Content-Type: application/json`

    - **Body**: Form-data with fields `name`, `picture` (file), `parent_id`

    - **Response**: None

5.  **Delete Category by ID**

    - **Method**: DELETE

    - **URL**: `{{base_url}}/api/categories/11`

    - **Body**: None

#### **Products**

1.  **Get All Products**

    - **Method**: GET

    - **URL**: `{{base_url}}/api/products`

    - **Body**: Empty (formdata mode)

    - **Response**: None

2.  **Create Product**

    - **Method**: POST

    - **URL**: `{{base_url}}/api/products`

    - **Headers**: `Content-Type: application/json`

    - **Body**: Form-data with fields `name`, `picture` (file), `category_id`

    - **Response**: None

3.  **Get Product by ID**

    - **Method**: GET

    - **URL**: `{{base_url}}/api/products/2`

    - **Body**: None

4.  **Update Product by ID**

    - **Method**: PUT

    - **URL**: `{{base_url}}/api/products/2`

    - **Headers**: `Content-Type: application/json`

    - **Body**: Form-data with fields `name`, `picture` (file), `category_id`

    - **Response**: None

5.  **Delete Product by ID**

    - **Method**: DELETE

    - **URL**: `{{base_url}}/api/products/6`

    - **Body**: None

### **Variables**

- **base_url**: `http://localhost:3000`

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
