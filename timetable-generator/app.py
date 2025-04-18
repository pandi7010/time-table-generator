from flask import Flask, render_template, request, jsonify
import random
from collections import defaultdict

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_timetable', methods=['POST'])
def generate_timetable():
    data = request.get_json()
    faculty_count = data['faculty_count']
    faculties = []

    for i in range(faculty_count):
        faculties.append({
            'name': data[f'faculty_name_{i}'],
            'subject': data[f'subject_{i}'],
            'code': data[f'course_code_{i}']
        })

    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    periods = ['9-10 AM', '10-11 AM', '11-12 PM', '12-1 PM', '1-2 PM', '2-3 PM', '3-4 PM', '4-5 PM']

    # Max 8 periods/day, 5 days = 40 slots total
    timetable_slots = [(day, period) for day in days for period in periods]
    random.shuffle(timetable_slots)

    # Each faculty gets nearly equal number of slots (fair distribution)
    faculty_slots = defaultdict(list)
    slots_per_faculty = len(timetable_slots) // len(faculties)
    remainder = len(timetable_slots) % len(faculties)

    slot_index = 0
    for i, faculty in enumerate(faculties):
        count = slots_per_faculty + (1 if i < remainder else 0)
        for _ in range(count):
            if slot_index < len(timetable_slots):
                faculty_slots[(timetable_slots[slot_index][0], timetable_slots[slot_index][1])] = f"{faculty['subject']} ({faculty['code']}) - {faculty['name']}"
                slot_index += 1

    timetable_data = []
    for day in days:
        for period in periods:
            key = (day, period)
            entry = faculty_slots.get(key, 'Free Period')
            timetable_data.append({
                'day': day,
                'period': period,
                'entry': entry
            })

    return jsonify({'timetable': timetable_data})

if __name__ == "__main__":
    app.run(debug=True)
