from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone
from User.models import User

CURRENCY_CHOICES = [
    ('YER', 'YER'),
    ('USD', 'USD'),
]

CATEGORY_CHOICES = [    
  ('Food', 'Food'),
  ('Transport', 'Transport'),
  ('Rent', 'Rent'),
  ('Bills', 'Bills'),
  ('Shopping', 'Shopping'),
  ('Entertainment', 'Entertainment'),
  ('Other', 'Other'),
]

class Expense(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='expenses'
    )
    subject = models.CharField(max_length=100)
    merchant = models.CharField(max_length=100)
    date = models.DateField(default=timezone.now)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='Other')
    reimbursable = models.BooleanField(default=False)
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    total_currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='YER')
    description = models.TextField(blank=True, null=True)
    invoice = models.FileField(
        upload_to='expenses/invoices/',
        blank=True,
        null=True,
        help_text='Upload invoice (JPG/PNG)'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.subject} - {self.total_amount} {self.total_currency}"

    class Meta:
        ordering = ['-date']
