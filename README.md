#Pharmacy Management System 💊

![MedCure Logo](src/assets/images/logo-transparent.png)

**MedCure** is a modern, all-in-one pharmacy management system designed to streamline inventory, sales, and customer management. Built with a clean and intuitive user interface, it helps pharmacy owners and staff manage their daily operations with ease and efficiency.

---

## ✨ Features

-   **📊 Interactive Dashboard:** Get a real-time overview of your pharmacy's performance with key metrics like inventory status, sales figures, and profit tracking.
-   **📦 Product Management:** Easily add, edit, and archive products. Keep track of quantities, prices, categories, and expiration dates.
-   **🛒 Point of Sale (P.O.S.):** A sleek and responsive P.O.S. interface for quick and easy transactions, with integrated discount options for PWD/Seniors.
-   **📜 Sales History & Receipts:** View a comprehensive history of all sales transactions and print professional PDF receipts for any sale.
-   **📂 Data Import/Export:** Bulk import product data from CSV files and export detailed inventory reports to PDF.
-   **⚙️ Customizable Settings:** Tailor the application to your needs by updating branding, profile information, and security settings.
-   **🔒 Secure Authentication:** Built with Supabase for secure and reliable user authentication.

---

## 🛠️ Tech Stack

-   **Frontend:** [React](https://reactjs.org/) & [Vite](https://vitejs.dev/)
-   **Backend & Database:** [Supabase](https://supabase.io/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **PDF Generation:** [jsPDF](https://github.com/parallax/jsPDF) & [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v16 or higher)
-   npm or yarn

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/your_username/medcure.git](https://github.com/your_username/medcure.git)
    ```
2.  **Navigate to the project directory**
    ```sh
    cd medcure
    ```
3.  **Install NPM packages**
    ```sh
    npm install
    ```
4.  **Set up your Supabase environment variables**

    Create a `.env` file in the root of your project and add your Supabase URL and Anon Key:
    ```
    VITE_SUPABASE_URL=YOUR_SUPABASE_URL
    VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```
5.  **Run the development server**
    ```sh
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

---

## 📸 Screenshots

*(Add screenshots of your application here to showcase the UI)*

| Dashboard | Point of Sale |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
|  |  |
| **Product Management** | **Sales History** |
|  |  |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
