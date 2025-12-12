// studyMaterials.js - Handles study materials functionality
import { fetchData, attachTableActionListeners } from './utils';

export async function renderStudyMaterials() {
    const studyMaterials = await fetchData('/study-materials');
    const studyMaterialColumns = [
        { header: 'ID', field: 'id', sortable: true },
        { header: 'Class', field: 'class', sortable: true },
        { header: 'Subject', field: 'subject', sortable: true },
        { header: 'Title', field: 'title', sortable: true },
        { header: 'File', field: 'file_url', render: (val) => val ? `<a href="${val}" target="_blank" class="text-link">Download</a>` : 'N/A' },
        { header: 'Actions', field: 'actions', render: (val, row) => `
            <button class="action-btn view-btn" title="View Details" data-id="${row.id}" data-table="study_materials"><span class="material-icons">visibility</span></button>
        ` },
    ];

    attachTableActionListeners('study-materials-table', studyMaterials, studyMaterialColumns, '/study-materials');
}
