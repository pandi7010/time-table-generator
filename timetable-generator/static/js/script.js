function saveTimetable() {
    const timetableData = [];
    for (let i = 0; i < 5; i++) {  // 5 days (Monday - Friday)
        const day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][i];
        for (let j = 1; j <= 6; j++) {  // 6 periods (9-10AM to 3-4PM)
            const subject = document.getElementById(`${day.toLowerCase().slice(0, 3)}-${j}`).value;
            timetableData.push({
                day: day,
                period: `${j}-period`,
                subject: subject || '',
                faculty: ''
            });
        }
    }

    fetch('/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timetableData)
    }).then(response => response.json())
      .then(data => alert(data.message));
}

function loadTimetable() {
    fetch('/load')
        .then(response => response.json())
        .then(data => {
            data.forEach(entry => {
                const inputId = `${entry.day.toLowerCase().slice(0, 3)}-${entry.period.split('-')[0]}`;
                document.getElementById(inputId).value = entry.subject;
            });
        });
}
// Function to generate input fields for faculty details based on the number entered
document.getElementById('faculty-count').addEventListener('input', function() {
    const count = parseInt(this.value);
    const facultyInputs = document.getElementById('faculty-inputs');
    facultyInputs.innerHTML = '';
    for (let i = 0; i < count; i++) {
        facultyInputs.innerHTML += `
            <div class="faculty-form mb-3">
                <h5>Faculty ${i + 1}</h5>
                <label for="faculty-name-${i}" class="form-label">Faculty Name</label>
                <input type="text" class="form-control" id="faculty-name-${i}" placeholder="Enter faculty name" required>
                
                <label for="subject-${i}" class="form-label mt-2">Subject Name</label>
                <input type="text" class="form-control" id="subject-${i}" placeholder="Enter subject name" required>
                
                <label for="course-code-${i}" class="form-label mt-2">Course Code</label>
                <input type="text" class="form-control" id="course-code-${i}" placeholder="Enter course code" required>
            </div>
        `;
    }
});

