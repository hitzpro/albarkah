document.addEventListener("DOMContentLoaded", function () {
    const steps = document.querySelectorAll('.tk-step');
    const stepContents = document.querySelectorAll('.step-content');
    const nextButton = document.querySelector('#nextBtn');
    const submitButton = document.querySelector('.tk-submit-button');
    const stepIndicators = document.querySelectorAll('.tk-step');
    const totalSteps = steps.length; // Get the actual number of steps from the indicators
    console.log("Total steps:", totalSteps);

    let currentStep = 1; // Step default saat halaman dimuat adalah Step 1

    // Menampilkan Step pertama saat halaman dimuat
    setActiveStep(currentStep);

    // Fungsi untuk mengatur step yang aktif
    function setActiveStep(stepNumber) {
        // Menyembunyikan Step yang tidak aktif
        stepContents.forEach(content => {
            content.classList.remove('active');
            if (content.dataset.step == stepNumber) {
                content.classList.add('active');
            }
        });

        // Mengatur langkah-langkah yang telah dilalui
        steps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.dataset.step) <= stepNumber) {
                step.classList.add('completed');
            }
        });

        // Mengatur indikator warna
        updateIndicators(stepNumber);

        // Check if this is the last step
        if (stepNumber === totalSteps) {
            submitButton.style.display = "inline-block";
            nextButton.style.display = "none";
        
            // Hanya tampilkan judul dan paragraf pertama
            document.querySelector('.confuse1').style.display = "none";
            document.querySelector('.messege').style.display = "none";
            document.querySelector('.unggah-file').style.display = "none";
            document.querySelector('.unggah-file-list').style.display = "none";
            document.querySelector('.messege-wali').style.display = "none";
            document.querySelector('.messege-ortu').style.display = "none";
        
            // Ambil semua anak dari .tk-info-box kecuali h3 dan paragraf pertama
            const infoBox = document.querySelector('.tk-info-box');
            const children = Array.from(infoBox.children);
            children.forEach((child, index) => {
                if (index > 1) {
                    child.style.display = "none";
                } else {
                    child.style.display = "block";
                }
            });
        } else {
            // Show next button on all other steps, hide submit button
            submitButton.style.display = "none";
            nextButton.style.display = "inline-block";
            document.querySelector('.confuse1').style.display = "none";
            document.querySelector('.messege').style.display = "none";
        
            // Special case for step 4
            if (stepNumber === 4) {
                document.querySelector('.unggah-file').style.display = "inline-block";
                document.querySelector('.unggah-file-list').style.display = "inline-block";
            } else {
                document.querySelector('.unggah-file').style.display = "none";
                document.querySelector('.unggah-file-list').style.display = "none";
            }
        
            // Special case for step 2
            if (stepNumber === 2) {
                document.querySelector('.messege-ortu').style.display = "block";
            } else {
                document.querySelector('.messege-ortu').style.display = "none";
            }
        
            // Special case for step 3
            if (stepNumber === 3) {
                document.querySelector('.messege-wali').style.display = "block";
                document.querySelector('.confuse1').style.display = "block";
            } else {
                document.querySelector('.messege-wali').style.display = "none";
                document.querySelector('.confuse1').style.display = "none";
            }

            if (stepNumber === 5) {
                document.querySelector('.messege').style.display = "inline-block";
            } else {
                document.querySelector('.messege').style.display = "none";
                document.querySelector('.confuse1').style.display = "none";

            }
            
        }
        
        // Melakukan scroll otomatis ke step yang aktif
        scrollToStep(stepNumber);

        // Validasi input di setiap step
        validateStep(stepNumber);
    }

    // Fungsi untuk memperbarui warna indikator sesuai dengan langkah
    function updateIndicators(stepNumber) {
        stepIndicators.forEach(indicator => {
            const indicatorStep = parseInt(indicator.dataset.step);
            if (indicatorStep <= stepNumber) {
                // Indikator yang sudah dilalui atau sedang aktif, beri warna
                indicator.classList.add('completed');
            } else {
                // Indikator yang belum dilalui, hilangkan warna
                indicator.classList.remove('completed');
            }
        });
    }

    // Tombol Next untuk berpindah ke step berikutnya
    if (nextButton) {
        nextButton.addEventListener('click', function () {
            if (currentStep < totalSteps) {
                currentStep++;
                setActiveStep(currentStep);
            }
        });
    }

    // Fungsi untuk scroll ke step tertentu
    function scrollToStep(stepNumber) {
        const targetStep = document.querySelector(`.step-content[data-step="${stepNumber}"]`);
        if (targetStep) {
            window.scrollTo({
                top: targetStep.offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // Fungsi untuk memvalidasi input pada setiap step
    function validateStep(stepNumber) {
        const inputs = document.querySelectorAll(`.step-content[data-step="${stepNumber}"] input, .step-content[data-step="${stepNumber}"] textarea`);
        inputs.forEach(input => {
            input.addEventListener('input', function () {
                const step = document.querySelector(`.tk-step[data-step="${stepNumber}"]`);
                if (input.value.trim() !== "") {
                    step.classList.add('completed');
                } else {
                    step.classList.remove('completed');
                }
            });
        });
    }

    // Klik pada indikator untuk berpindah antar langkah
    stepIndicators.forEach(step => {
        step.addEventListener('click', function () {
            const stepNumber = parseInt(this.dataset.step);
            currentStep = stepNumber;
            setActiveStep(currentStep);
        });
    });
});