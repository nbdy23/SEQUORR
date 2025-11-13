// Supabase Form Submission
(function() {
    const SUPABASE_URL = 'https://bpftsgsidpfknwctrfvw.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwZnRzZ3NpZHBma253Y3RyZnZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MDA2NzEsImV4cCI6MjA3NzI3NjY3MX0.zkcQMRncoKcuSzthUZ18fgMBUQqvWyoYr2h2Fv-WNsA';
    
    const submitFeedback = async (formData) => {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/general`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return { success: true };
        } catch (error) {
            console.error('Submission error:', error);
            return { success: false, error: error.message };
        }
    };

    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('feedbackForm');
        const successMessage = document.getElementById('successMessage');

        if (form) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();

                const formData = {
                    full_name: form.querySelector('[name="name"]').value,
                    email: form.querySelector('[name="email"]').value,
                    category: form.querySelector('[name="category"]').value,
                    message: form.querySelector('[name="message"]').value,
                    created_at: new Date().toISOString()
                };

                const submitBtn = form.querySelector('.submit-button');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';

                const result = await submitFeedback(formData);

                if (result.success) {
                    successMessage.classList.add('show');
                    form.reset();
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                    }, 5000);
                } else {
                    alert('Error submitting feedback. Please try again.');
                }

                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Feedback';
            });
        }
    });
})();