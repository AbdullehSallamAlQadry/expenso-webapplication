# Expenso Webapplication

A web application for managing your expenses and tracking them with invoice images. Users can add, describe, edit, and follow all their expenses in a simple and visual way.

## Project Structure

- **expenso** – React frontend
- **expenso_dash** – Django backend

The frontend communicates with the backend API to manage and display expenses.

### Features

- **Add Expenses** – Include descriptions, invoice images, category, and date.
- **Edit Expenses** – Update existing expense entries easily.
- **Visualize Expenses** – Track yearly expenses using charts.
- **Search & Filter** – Filter expenses by date, category, order (amount, alphabetical, or date), currency, or reimbursable status.

---

## The Libraries

### React (Frontend)
- **react, react-dom, react-scripts** – Core React setup
- **@fortawesome/*** – Font Awesome icons (brands, regular, solid)
- **@testing-library/*** – React testing utilities
- **css-loader, postcss-loader, sass-loader, sass, resolve-url-loader** – CSS/SCSS support
- **date-fns, moment** – Date handling
- **react-datepicker** – Date picker component
- **recharts** – Charts for data visualization
- **web-vitals** – Measure frontend performance

### Django (Backend)
- **Django** – Web framework
- **djangorestframework** – Build REST APIs
- **django-cors-headers** – Handle cross-origin requests from React
- **django-filter** – API queryset filtering
- **pillow** – Image handling for invoices
- **asgiref, sqlparse, tzdata** – Core Django dependencies
