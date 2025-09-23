import json
import os
import glob

def load_json_report(filepath):
    """Load JSON report and extract key metrics."""
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return None

def compile_reports():
    """Compile and summarize reports from different testing tools."""
    report_dir = "/home/jack/Documents/aclue-preprod/tests-22-sept/automated/api/reports"
    reports = {
        "schemathesis": load_json_report(os.path.join(report_dir, "schemathesis_report.json")),
        "apifuzzer": load_json_report(os.path.join(report_dir, "apifuzzer_report.json")),
        "newman": load_json_report(os.path.join(report_dir, "newman_report.json"))
    }

    summary = {
        "total_tests": 0,
        "passed_tests": 0,
        "failed_tests": 0,
        "test_coverage": {},
        "vulnerabilities": []
    }

    # Aggregate results from different reports
    for tool, report in reports.items():
        if report:
            # Placeholder logic - adapt based on actual report structures
            summary['total_tests'] += report.get('total_tests', 0)
            summary['passed_tests'] += report.get('passed_tests', 0)
            summary['failed_tests'] += report.get('failed_tests', 0)

            # Capture vulnerabilities if found
            if tool == 'apifuzzer':
                summary['vulnerabilities'] = report.get('vulnerabilities', [])

    # Write comprehensive summary
    with open(os.path.join(report_dir, "api_testing_summary.json"), 'w') as f:
        json.dump(summary, f, indent=2)

    print("Report compilation complete.")

if __name__ == "__main__":
    compile_reports()