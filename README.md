# Expenso Webapplication
A web application for managing your expenses and tracking them with invoice images. Users can add, describe, edit, and follow all their expenses in a simple and visual way.

#Project Structure
1.expenso – React frontend
2.expenso_dash – Django backend
The frontend communicates with the backend API to manage and display expenses.

#Features
1.Add Expenses – Include descriptions, invoice images, category, and date.
2.Edit Expenses – Update existing expense entries easily.
3.Visualize Expenses – Track yearly expenses using charts.
4.Search & Filter – Filter expenses by date, category, order (amount, alphabetical, or date), currency, or reimbursable status.

#The Librarys
1. React(Frontend):
  react, react-dom, react-scripts – Core React setup
  @fortawesome/* – Font Awesome icons (brands, regular, solid)
  @testing-library/* – React testing utilities
  css-loader, postcss-loader, sass-loader, sass, resolve-url-loader – CSS/SCSS support
  date-fns, moment – Date handling
  react-datepicker – Date picker component
  recharts – Charts for data visualization
  web-vitals – Measure frontend performance
2. Django(Backend):
  Django – Web framework
  djangorestframework – Build REST APIs
  django-cors-headers – Handle cross-origin requests from React
  django-filter – API queryset filtering
  pillow – Image handling for invoices
  asgiref, sqlparse, tzdata – Core Django dependencies

