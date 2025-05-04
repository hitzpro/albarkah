document.addEventListener('DOMContentLoaded', function() {
    // Initialize components

    initAccordions();
    initTabButtons();
    initButtonActions();
    initFormStepToggles();
});


/**
 * Show notification using SweetAlert2
 * @param {string} type - 'success', 'error', 'warning', 'info'
 * @param {string} message - Notification message
 */
function showNotification(type, message) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });
    
        // Menampilkan toast
        Toast.fire({
            icon: type,
            title: message
        }).then(() => {
            // Redirect setelah toast selesai
            if (type === 'success') {
                window.location.href = 'benerin_form.php?jenjang=tk'; // Ubah URL sesuai keinginan
            }
        });
}







/**
 * Initialize accordion functionality for section headers
 */
function initAccordions() {
    const accordionHeaders = [
        {
            header: document.getElementById('aturStepHeader'),
            content: document.getElementById('aturStepContent')
        },
        {
            header: document.getElementById('aturFormHeader'),
            content: document.getElementById('aturFormContent'),
            onOpen: initFormStepToggles
        }
    ];

    accordionHeaders.forEach(({ header, content, onOpen }) => {
        header.addEventListener('click', function () {
            const icon = header.querySelector('i');
            icon.classList.toggle('rotate');

            const isHidden = content.style.display === 'none';

            content.style.display = isHidden ? 'block' : 'none';

            // Panggil fungsi toggle hanya saat konten baru dibuka
            if (isHidden && typeof onOpen === 'function') {
                console.log("Accordion opened. Initializing form step toggles...");
                onOpen();
                initFormStepToggles();
            }
        });

        // 🟢 Panggil onOpen langsung jika kontennya sudah terlihat sejak awal
        const isVisible = content.style.display !== 'none';
        if (isVisible && typeof onOpen === 'function') {
            console.log("Content already visible. Initializing form step toggles immediately...");
            onOpen();
            initFormStepToggles();
        }
    });
}



/**
 * Initialize tab buttons
 */
function initTabButtons() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabText = this.textContent.trim().toLowerCase();
            let jenjang = 'tk';

            if (tabText === 'smp') {
                jenjang = 'smp';
            } else if (tabText.includes('tk') || tabText.includes('sd')) {
                jenjang = 'tk';  // Sesuaikan dengan logika backend
            }

            // Arahkan ulang halaman dengan parameter jenjang
            window.location.href = `benerin_form.php?jenjang=${jenjang}`;
        });
    });
}



/**
 * Initialize action buttons (edit, delete, add)
 */
function initButtonActions() {
    // Add Step Button
    const addStepBtn = document.getElementById('addStepBtn');
    if (addStepBtn) {
        addStepBtn.addEventListener('click', function () {
            const modal = document.getElementById('modalAddStep');
            modal.style.display = 'block';
        });
        
        // Tombol batal untuk menutup modal
        document.getElementById('btnCloseModal').addEventListener('click', function () {
            document.getElementById('modalAddStep').style.display = 'none';
        });
        
        
    }
    
    // Add Field Buttons
    const customModal = document.getElementById('customModalField');
    const stepInput = document.getElementById('custom_step_number');
    const stepSelect = document.getElementById('custom_step_id');
    const fieldType = document.getElementById('custom_field_type');
    
    const optionsGroup = document.getElementById('custom_options_group');
    const fileInfoGroup = document.getElementById('custom_file_info_group');
    
    const addFieldButtons = document.querySelectorAll('[id^="addFieldBtn"]');
    addFieldButtons.forEach(button => {
      button.addEventListener('click', function () {
        const stepNumber = this.id.replace('addFieldBtn', '');
        stepInput.value = stepNumber;
        stepSelect.value = stepNumber;
        customModal.style.display = 'block';
      });
    });
    
    document.getElementById('customCancelBtn').addEventListener('click', function () {
      customModal.style.display = 'none';
      document.getElementById('customFieldForm').reset();
      optionsGroup.style.display = 'none';
      fileInfoGroup.style.display = 'none';
    });
    
    fieldType.addEventListener('change', function () {
      const val = this.value;
      optionsGroup.style.display = ['select', 'radio', 'checkbox'].includes(val) ? 'block' : 'none';
      fileInfoGroup.style.display = val === 'file' ? 'block' : 'none';
    });

    const openModal = () => {
        document.querySelector('.custom-modal').style.display = 'block';
        document.body.classList.add('modal-open');
      }
      
      const closeModal = () => {
        document.querySelector('.custom-modal').style.display = 'none';
        document.body.classList.remove('modal-open');
      }
      
    
      const editButtons = document.querySelectorAll('.edit-button');
      const modalEditStep = document.getElementById('modalEditStep');
      const modalEditField = document.getElementById("editModalField");
      const body = document.body;
          // Check if modal exists
        if (!modalEditField) {
            console.error("Error: Modal element 'editModalField' not found in the DOM");
            return; // Exit early if modal doesn't exist
        }
      
            // Helper function to safely set element value or state
        function safeSetElement(id, value, property = 'value') {
            const element = document.getElementById(id);
            if (element) {
                if (property === 'checked') {
                    element.checked = value;
                } else if (property === 'style.display') {
                    element.style.display = value;
                } else {
                    element[property] = value;
                }
            } else {
                console.warn(`Element with ID '${id}' not found`);
            }
        }
        
      editButtons.forEach(button => {
          button.addEventListener('click', function(e) {
              e.stopPropagation();
      
              const isStep = this.closest('.step-item');
              const isField = this.closest('.field-item');
      
              if (isStep) {
                  const stepId = this.getAttribute('data-step-id');
      
                  fetch(`../logic/get_step_data.php?step_id=${stepId}`)
                      .then(response => response.json())
                      .then(data => {
                          if (data.error) {
                              alert(data.error);
                          } else {
                              document.getElementById('edit_step_id').value = data.step_id;
                              document.getElementById('edit_stepNumber').value = data.step_number;
                              document.getElementById('edit_stepTitle').value = data.step_title;
      
                              modalEditStep.style.display = 'block';
                              body.classList.add('modal-open');
                          }
                      })
                      .catch(error => {
                          console.error('Terjadi kesalahan:', error);
                      });
      
              } else if (isField) {
                try {
                    // Get the field data from the data-field attribute
                    const fieldDataStr = this.getAttribute('data-field');
                    if (!fieldDataStr) {
                        console.error("Error: No data-field attribute found on button");
                        return;
                    }
                    
                    const fieldData = JSON.parse(fieldDataStr);
                    
                    // Set form values using the safe function
                    safeSetElement('edit_field_id', fieldData.field_id || '');
                    safeSetElement('edit_field_label', fieldData.field_label || '');
                    safeSetElement('edit_field_name', fieldData.field_name || '');
                    safeSetElement('edit_step_id', fieldData.step_id || '');
                    safeSetElement('edit_field_order', fieldData.field_order || '');
                    safeSetElement('edit_field_type', fieldData.field_type || '');
                    safeSetElement('edit_field_placeholder', fieldData.field_placeholder || '');
    
                    // Toggle options if field type is select/radio/checkbox
                    if (["select", "radio", "checkbox"].includes(fieldData.field_type)) {
                        safeSetElement('edit_options_group', 'block', 'style.display');
                        safeSetElement('edit_field_options', fieldData.field_options || '');
                    } else {
                        safeSetElement('edit_options_group', 'none', 'style.display');
                    }
    
                    // Toggle additional info if field type is file
                    if (fieldData.field_type === 'file') {
                        safeSetElement('edit_file_info_group', 'block', 'style.display');
                        safeSetElement('edit_additional_info', fieldData.additional_info || '');
                    } else {
                        safeSetElement('edit_file_info_group', 'none', 'style.display');
                    }
    
                    // Set checkbox values
                    safeSetElement('edit_is_required', fieldData.is_required == 1, 'checked');
                    safeSetElement('edit_is_active', fieldData.is_active == 1, 'checked');
    
                    // Show modal
                    modalEditField.style.display = 'block';
                    body.classList.add('modal-open');
                    
                    // Make sure the modal is visible
                    console.log("Modal should be visible now");
                    
                } catch (error) {
                    console.error("Error processing edit button click:", error);
                }
                
              }

                    // Tombol batal modal
                document.getElementById('btnCloseModalEditStep').addEventListener('click', function () {
                    modalEditStep.style.display = 'none';
                    body.classList.remove('modal-open');
                    });

                document.getElementById('btnCloseModalEditField').addEventListener('click', function () {
                        modalEditField.style.display = 'none';
                        body.classList.remove('modal-open');
                    });
          });
      });


    // Tombol batal untuk menutup modal
    const editCancelBtn = document.getElementById("editCancelBtn");
    if (editCancelBtn) {
        editCancelBtn.addEventListener("click", () => {
            modalEditField.style.display = "none";
            body.classList.remove("modal-open");
        });
    } else {
        console.warn("Element with ID 'editCancelBtn' not found");
    }
    
    // Close on X if it exists
    const closeX = modalEditField.querySelector(".close");
    if (closeX) {
        closeX.addEventListener("click", () => {
            modalEditField.style.display = "none";
            body.classList.remove("modal-open");
        });
    }

    
    
    // Debug info
    console.log("Edit buttons found:", editButtons.length);
    console.log("Modal found:", modalEditField ? "Yes" : "No");



      
    

    // Delete Buttons
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering accordion
            
            const isStep = this.closest('.step-item');
            const isField = this.closest('.field-item');
            
            if (isStep) {
                const stepId = this.dataset.stepId; // Ambil ID Step dari data-atribut
                const stepName = isStep.querySelector('.step-name').textContent;
                const stepNumber = isStep.querySelector('.step-number').textContent;
                
                console.log(`Delete button clicked for step ${stepNumber}: ${stepName}`);
                
                // Konfirmasi SweetAlert untuk menghapus step
                Swal.fire({
                    title: `Apakah Anda yakin ingin menghapus step ${stepName}?`,
                    text: `ID step: ${stepId}`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Arahkan ke script hapus step dan kirimkan ID step
                        window.location.href = `../logic/hapus_step.php?id=${stepId}`;
                    }
                });
            } else if (isField) {
                const fieldId = this.dataset.fieldId; // Ambil ID Field dari data-atribut
                const fieldLabel = this.dataset.fieldLabel;
                const fieldName = this.dataset.fieldName;
                const fieldType = this.dataset.fieldType;
                const fieldOrder = this.dataset.fieldOrder;
                const stepId = this.dataset.stepId; // Ambil step ID dari field
                
                console.log(`Delete button clicked for field ${fieldLabel} with ID: ${fieldId}`);
                
                // Konfirmasi SweetAlert untuk menghapus field
                Swal.fire({
                    title: `Apakah Anda yakin ingin menghapus field ${fieldLabel}?`,
                    text: `Field ID: ${fieldId}, Step ID: ${stepId}`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Arahkan ke script hapus field dan kirimkan data yang dibutuhkan
                        window.location.href = `../logic/hapus_field.php?id=${fieldId}&label=${encodeURIComponent(fieldLabel)}&name=${encodeURIComponent(fieldName)}&type=${encodeURIComponent(fieldType)}&order=${fieldOrder}&step_id=${stepId}`;
                    }
                });
            }
        });
    });


}

/**
 * Initialize form step toggles (accordion behavior for form steps)
 */
function initFormStepToggles(retryCount = 0) {
    const formStepHeaders = document.querySelectorAll('.form-step-header');
    console.log("initFormStepToggles called");
    console.log("Found form step headers:", formStepHeaders.length);

    if (formStepHeaders.length === 0) {
        if (retryCount < 5) {
            console.warn("Form step headers not found. Retrying...");
            setTimeout(() => initFormStepToggles(retryCount + 1), 300);
        } else {
            console.error("No .form-step-header elements found after retries.");
        }
        return;
    }

    formStepHeaders.forEach((header, index) => {
        console.log(`Preparing header ${index + 1}:`, header);

        header.addEventListener('click', function () {
            console.log(`Header clicked:`, this);
            const content = this.nextElementSibling;
            const icon = this.querySelector('i');
            const stepName = this.querySelector('.step-name')?.textContent || 'Unknown';

            if (!content) {
                console.error(`No sibling content found for step: ${stepName}`);
                return;
            }

            if (!icon) {
                console.error(`No icon found in header for step: ${stepName}`);
                return;
            }

            content.classList.toggle('hidden');
            icon.classList.toggle('fa-chevron-down');
            icon.classList.toggle('fa-chevron-up');

            console.log(`Toggled step: ${stepName}`);
        });

        console.log(`Event listener added to header ${index + 1}`);
    });
}



document.addEventListener("DOMContentLoaded", function() {
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");
    const overlay = document.getElementById("overlay");
    
    // Toggle sidebar when button is clicked
    sidebarToggle.addEventListener("click", function() {
        sidebar.classList.toggle("active");
        mainContent.classList.toggle("sidebar-active");
        overlay.classList.toggle("active");
        
        // Update toggle button position when sidebar is active
        if (sidebar.classList.contains("active")) {
            sidebarToggle.style.left = sidebar.offsetWidth + 15 + "px";
        } else {
            sidebarToggle.style.left = "15px";
        }
    });
    
    // Close sidebar when clicking on overlay
    overlay.addEventListener("click", function() {
        sidebar.classList.remove("active");
        mainContent.classList.remove("sidebar-active");
        overlay.classList.remove("active");
        sidebarToggle.style.left = "15px";
    });
    
    // Close sidebar when clicking on menu items (for mobile)
    const menuItems = document.querySelectorAll(".sidebar-menu a");
    menuItems.forEach(item => {
        item.addEventListener("click", function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove("active");
                mainContent.classList.remove("sidebar-active");
                overlay.classList.remove("active");
                sidebarToggle.style.left = "15px";
            }
        });
    });
    
    // Update sidebar state when window is resized
    window.addEventListener("resize", function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove("active");
            mainContent.classList.remove("sidebar-active");
            overlay.classList.remove("active");
            sidebarToggle.style.left = "15px";
        }
    });
});


// Tangkap submit form
document.getElementById("customFieldForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Mencegah pengiriman form secara default
    
    // PERBAIKAN: Buat FormData secara manual karena form tidak memiliki atribut name pada input
    const formData = new FormData();
    
    // Tambahkan semua field form ke FormData
    formData.append('step_id', document.getElementById('custom_step_id').value);
    formData.append('field_order', document.getElementById('custom_field_order').value);
    formData.append('field_label', document.getElementById('custom_field_label').value);
    formData.append('field_name', document.getElementById('custom_field_name').value);
    formData.append('field_type', document.getElementById('custom_field_type').value);
    formData.append('field_placeholder', document.getElementById('custom_field_placeholder').value);
    
    // Nilai checkbox diconvert ke 0/1
    formData.append('is_required', document.getElementById('custom_is_required').checked ? 1 : 0);
    formData.append('is_active', document.getElementById('custom_is_active').checked ? 1 : 0);
    
    // Tambahkan jenjang jika ada
    const jenjang = document.getElementById('custom_jenjang').value;
    formData.append('jenjang', jenjang || 'tk'); // Default ke 'tk' jika kosong
    
    // Cek tipe field untuk field options dan additional info
    const fieldType = document.getElementById('custom_field_type').value;
    
    // Jika tipe field adalah select, radio, atau checkbox, ambil nilainya
    if (fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox') {
        formData.append('field_options', document.getElementById('custom_field_options').value);
    }
    
    // Jika tipe field adalah file, ambil additional info
    if (fieldType === 'file') {
        formData.append('additional_info', document.getElementById('custom_additional_info').value);
    }
    
    // Log data yang akan dikirim (opsional, untuk debugging)
    console.log('Data yang dikirim:');
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    // Kirim data ke server menggunakan Fetch API
    fetch('../logic/tambah_field.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response:', data); // Log response untuk debugging
        
        // Cek status response dari server
        if (data.status === 'success') {
            document.getElementById('customModalField').classList.remove('show');
            document.getElementById('customFieldForm').reset();
            
            showNotification('success', data.message); // Tampilkan pesan success
            // Tutup modal dan reset form
            initFormStepToggles();
            
            // Reload halaman setelah sukses (opsional)
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } else {
            // Jika gagal, tampilkan pesan menggunakan Swal
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                html: data.message // Gunakan html untuk support <br>
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Terjadi kesalahan',
            text: 'Coba lagi nanti.'
        });
    });
});

// Tambahkan event untuk tipe field
document.getElementById('custom_field_type').addEventListener('change', function() {
    const type = this.value;
    const optionsGroup = document.getElementById('custom_options_group');
    const fileInfoGroup = document.getElementById('custom_file_info_group');
    
    // Toggle tampilan field options berdasarkan tipe field
    optionsGroup.style.display = 
        (type === 'select' || type === 'radio' || type === 'checkbox') ? 'block' : 'none';
    
    // Toggle tampilan additional info untuk tipe file
    fileInfoGroup.style.display = (type === 'file') ? 'block' : 'none';
});

// Fungsi untuk membuka modal
function openCustomModal(jenjang = 'tk', step = '') {
    // Reset form
    document.getElementById('customFieldForm').reset();
    
    // Set default values
    document.getElementById('custom_jenjang').value = jenjang;
    
    if (step) {
        document.getElementById('custom_step_id').value = step;
    }
    
    // Tampilkan modal
    document.getElementById('customModalField').classList.add('show');
}

// Tombol cancel untuk menutup modal
document.getElementById('customCancelBtn').addEventListener('click', function() {
    document.getElementById('customModalField').classList.remove('show');
});





document.addEventListener("DOMContentLoaded", function () {
    const modalAddStep = document.getElementById("modalAddStep");
    const inputStepNumber = document.getElementById("stepNumber");
    
    // Function to fetch the next step number
    function fetchNextStepNumber() {
        // Set a default value first
        inputStepNumber.value = "1";
        
        fetch("../logic/get_step_number.php")
            .then(response => {
                // Check if response is ok (status in the range 200-299)
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(`Server error: ${errorData.error || response.statusText}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Received data:", data);
                if (data && data.nextStep) {
                    inputStepNumber.value = data.nextStep;
                }
            })
            .catch(error => {
                console.error("Gagal mengambil step number:", error);
                // No need to set default value again, as we've already set it
                
                // Optionally show a user-friendly notification
                if (typeof showNotification === 'function') {
                    showNotification('warning', 'Gagal mengambil nomor step otomatis. Menggunakan nomor default.');
                } else if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Perhatian',
                        text: 'Gagal mengambil nomor step otomatis. Menggunakan nomor default.',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000
                    });
                }
            });
    }

    // Get all buttons that should open the modal
    const addStepBtns = document.querySelectorAll('[data-modal="modalAddStep"], #addStepBtn');
    
    // Add click event to all buttons
    addStepBtns.forEach(button => {
        button.addEventListener("click", function () {
            // Display the modal
            modalAddStep.style.display = "block";
            
            // Fetch the next step number
            fetchNextStepNumber();
        });
    });

    // Close button event
    const btnCloseModal = document.getElementById("btnCloseModal");
    if (btnCloseModal) {
        btnCloseModal.addEventListener("click", function () {
            modalAddStep.style.display = "none";
        });
    }

    // Also close on ESC key
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape" && modalAddStep.style.display === "block") {
            modalAddStep.style.display = "none";
        }
    });
});