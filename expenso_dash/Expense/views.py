from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Expense
from .serializer import ExpenseSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, DateFromToRangeFilter
from rest_framework import status
from rest_framework.exceptions import NotFound
from django.db.models import Count, Sum, Q
from django.db.models.functions import TruncMonth
from datetime import datetime, timedelta
import calendar
from dateutil.relativedelta import relativedelta

class ExpenseFilter(FilterSet):
    date = DateFromToRangeFilter()  
    
    class Meta:
        model = Expense
        fields = {
            'category': ['exact'],
            'total_currency': ['exact'],
            'reimbursable': ['exact'],
        }

class CustomPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'

class ExpenseViews(viewsets.ModelViewSet): 
    queryset = Expense.objects.all()
    pagination_class = CustomPagination
    serializer_class = ExpenseSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    search_fields = ['subject', 'merchant'] 
    ordering_fields = ['total_amount', 'subject', 'date']  
    ordering = ['-date'] 
    filterset_class = ExpenseFilter  # Use our custom filter class

    @action(detail=False, methods=['get'], url_path='info/user-id/(?P<user_id>[^/.]+)')
    def info_by_user(self, request, user_id=None):
        category_count = Expense.objects.filter(user_id = user_id).values('category').annotate(count=Count('category'))
        category_count_dict = {item['category'].upper(): item['count'] for item in category_count}
        if not category_count_dict:
            return Response({"Response": False, "message": "No data found"}, status=status.HTTP_200_OK)
        
        expense_count = Expense.objects.filter(user_id=user_id).aggregate(
            Submitted=Sum('total_amount', filter=Q(reimbursable=True)),
            Unsubmitted=Sum('total_amount', filter=Q(reimbursable=False)),
            Total=Sum('total_amount')
        )
        expense_count = {k: (v or 0) for k, v in expense_count.items()}
        
        now = datetime.now()
        twelve_months_ago = (now.replace(day=1) - relativedelta(months=12))
        #Get monthly totals
        monthly_expenses = (
            Expense.objects.filter(user_id=user_id, date__gte=twelve_months_ago, date__lt=now.replace(day=1))
            .annotate(month=TruncMonth('date'))
            .values('month')
            .annotate(total=Sum('total_amount'))
            .order_by('month')
        )
        #Make dict for lookup (e.g. {"2025-01": 200, "2025-03": 500})
        monthly_expenses_data = {
            entry['month'].strftime('%b'): entry['total'] or 0
            for entry in monthly_expenses
        }
        #Generate a full 12-month list
        data = []
        for i in range(12):  # 11 → 0 (12 months)
            month_date = now.replace(day=1) - timedelta(days=i * 30)
            key = month_date.strftime("%b")
            total = monthly_expenses_data.get(key, 0)
            data.append({
                "month": calendar.month_abbr[month_date.month],  # e.g. Jan, Feb
                "year": month_date.year,
                "total": total
        })
        if not monthly_expenses_data:
            return Response({"Response": False, "message": "No data found"}, status=status.HTTP_200_OK)
        
        return Response({"Response": True, "category_count": category_count_dict, "expense_count": expense_count, "monthly_expenses": data}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get', 'post', 'delete', 'put'], url_path='user-id/(?P<user_id>[^/.]+)')
    def by_user(self, request, user_id=None):
        #create controller
        if request.method == 'POST':
            serializer = ExpenseSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user_id=user_id)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        #delete controller
        if request.method == 'DELETE':
            ids = request.data.get("ids", [])
            if not isinstance(ids, list) or not ids:
                return Response(
                    {"error": "Please provide a list of IDs in 'ids'."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            expenses_to_delete = Expense.objects.filter(user_id=user_id, id__in=ids)
            expenses_to_delete.delete()
            return Response(status=status.HTTP_200_OK)
        
        # update controller
        if request.method == 'PUT':
            expenseId = request.data.get('id')
            if not expenseId:
                return Response({"error": "expenseId is required"}, status=status.HTTP_400_BAD_REQUEST)
            try:
                expense = Expense.objects.get(user_id=user_id, id=expenseId)
            except Expense.DoesNotExist:
                return Response({"error": "Expense not found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = ExpenseSerializer(expense, data=request.data, partial=True)  
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        #page controller
        queryset = Expense.objects.filter(user_id=user_id)
        queryset = self.filter_queryset(queryset)
        try:
            page = self.paginate_queryset(queryset)
        except NotFound:
            return Response(
                {"message": "Page not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        if page is not None:
          if not page:  
              return Response(
                  {"message": "No expenses found on this page."},
                  status=status.HTTP_200_OK
              )
          serializer = ExpenseSerializer(page, many=True)
          return self.get_paginated_response(serializer.data)

        if not queryset.exists():
            return Response(
                {"message": "No expenses found for this user."},
                status=status.HTTP_200_OK
            )

        serializer = ExpenseSerializer(queryset, many=True)
        return Response(serializer.data)