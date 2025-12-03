import pandas as pd
import os
import json
from datetime import datetime
import warnings

# Suppress openpyxl warnings about data validation
warnings.filterwarnings('ignore', category=UserWarning, module='openpyxl')

# Configuration
INPUT_FILE = 'data/migration/FIELD_LEADS_2025_3_0_MV_test.xlsx'
OUTPUT_CSV = 'data/migration/raw_leads.csv'
REPORT_FILE = 'data/migration/quality_report.json'

def extract_and_analyze():
    print(f"Starting extraction from {INPUT_FILE}...")
    
    if not os.path.exists(INPUT_FILE):
        print(f"Error: Input file not found at {INPUT_FILE}")
        print("Please place the Excel file in the 'data/migration' folder.")
        return

    try:
        # Read all sheets
        xls = pd.ExcelFile(INPUT_FILE)
        all_sheets = []
        sheet_stats = {}

        print(f"Found {len(xls.sheet_names)} sheets. Processing...")

        for sheet_name in xls.sheet_names:
            try:
                df = pd.read_excel(xls, sheet_name=sheet_name)
                
                # Basic cleanup: Drop completely empty rows/cols
                df.dropna(how='all', inplace=True)
                df.dropna(axis=1, how='all', inplace=True)
                
                # Add metadata columns
                df['source_sheet'] = sheet_name
                df['extraction_date'] = datetime.now().isoformat()
                
                # Normalize column names (lowercase, strip, replace spaces)
                df.columns = [str(col).strip().lower().replace(' ', '_').replace('#', 'num') for col in df.columns]
                
                all_sheets.append(df)
                
                # Collect stats for this sheet
                sheet_stats[sheet_name] = {
                    'rows': len(df),
                    'columns': list(df.columns)
                }
                
            except Exception as e:
                print(f"Error processing sheet {sheet_name}: {e}")

        # Consolidate
        if not all_sheets:
            print("No data extracted.")
            return

        master_df = pd.concat(all_sheets, ignore_index=True)
        print(f"Consolidation complete. Total records: {len(master_df)}")

        # Quality Analysis
        quality_report = {
            'total_records': len(master_df),
            'total_sheets': len(xls.sheet_names),
            'extraction_timestamp': datetime.now().isoformat(),
            'columns_found': list(master_df.columns),
            'completeness': {},
            'sheet_details': sheet_stats
        }

        # Calculate completeness per column
        for col in master_df.columns:
            non_null = master_df[col].count()
            completeness = (non_null / len(master_df)) * 100
            quality_report['completeness'][col] = round(completeness, 2)

        # Export CSV
        os.makedirs(os.path.dirname(OUTPUT_CSV), exist_ok=True)
        master_df.to_csv(OUTPUT_CSV, index=False)
        print(f"Master CSV saved to {OUTPUT_CSV}")

        # Export Report
        with open(REPORT_FILE, 'w') as f:
            json.dump(quality_report, f, indent=2)
        print(f"Quality report saved to {REPORT_FILE}")

    except Exception as e:
        print(f"Critical error during extraction: {e}")

if __name__ == "__main__":
    extract_and_analyze()
