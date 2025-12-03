import pandas as pd
import os

# Create a mock Excel file for testing
file_path = 'data/migration/FIELD_LEADS_2025_3_0_MV_test.xlsx'

# Ensure directory exists
os.makedirs(os.path.dirname(file_path), exist_ok=True)

# Create sample dataframes
df1 = pd.DataFrame({
    'Lead Name': ['John Doe', 'Jane Smith'],
    'Phone': ['555-0101', '555-0102'],
    'Address': ['123 Main St', '456 Oak Ave'],
    'Status': ['Cold', 'Warm']
})

df2 = pd.DataFrame({
    'Lead Name': ['Bob Johnson'],
    'Phone Number': ['555-0103'], # Inconsistent column name
    'Address': ['789 Pine Ln'],
    'Notes': ['Interested']
})

# Write to Excel with multiple sheets
with pd.ExcelWriter(file_path) as writer:
    df1.to_excel(writer, sheet_name='Week 1', index=False)
    df2.to_excel(writer, sheet_name='Week 2', index=False)

print(f"Created mock Excel file at {file_path}")
