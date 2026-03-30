/* =============================================
   APP.JS – Logic for RPE, PROTA, PROMES
   ============================================= */

// ─── Month Lists ───
const MONTHS_GANJIL = ["Juli","Agustus","September","Oktober","November","Desember"];
const MONTHS_GENAP  = ["Januari","Februari","Maret","April","Mei","Juni"];

// ─── Default Non-Effective ───
const DEFAULT_NON_EFF = [
  {t:"Libur akhir / awal tahun pelajaran",w:2},
  {t:"Libur hari raya / nasional",w:1},
  {t:"Asesmen Sumatif / Ujian",w:2},
  {t:"Jeda tengah semester",w:1},
  {t:"Kegiatan khusus sekolah",w:1},
];

// ─── Helpers ───
const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const val = id => ($(id)?.value ?? "");

// ─── Tab Navigation ───
document.addEventListener("DOMContentLoaded",()=>{
  $$(".tab-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      $$(".tab-btn").forEach(b=>b.classList.remove("active"));
      $$(".tab-content").forEach(c=>c.classList.remove("active"));
      btn.classList.add("active");
      $(`#tab-${btn.dataset.tab}`).classList.add("active");
    });
  });

  // Init
  $("#semester").addEventListener("change",()=>{ initMonths(); buildPromesHeader(); resetPromesBody(); });
  $("#jpPerMinggu").addEventListener("input", calc);

  initMonths();
  initNonEff();
  initProta();
  buildPromesHeader();
  initPromes();
  setTodayDate();

  // Delegated events
  document.addEventListener("input",e=>{
    if(e.target.closest(".tbl")) calc();
  });
  document.addEventListener("click",e=>{
    const del = e.target.closest(".btn-del");
    if(del){ del.closest("tr").remove(); renum(); calc(); }
  });
});

// ─── Set Default Date ───
function setTodayDate(){
  const d = new Date();
  const iso = d.toISOString().split("T")[0];
  $("#tglTtd").value = iso;
}

// ─── Init Month Table ───
function initMonths(){
  const sem = val("#semester");
  const months = sem==="Ganjil" ? MONTHS_GANJIL : MONTHS_GENAP;
  const tb = $("#tblMonth tbody"); tb.innerHTML="";
  months.forEach(m=>_addMonthRow(tb,m,4));
  calc();
}
function addMonthRow(){ _addMonthRow($("#tblMonth tbody"),"",4); calc(); }
function _addMonthRow(tb,name,w){
  const tr=document.createElement("tr");
  tr.innerHTML=`<td class="rn"></td><td><input value="${name}" placeholder="Bulan"></td><td><input type="number" value="${w}" min="0" class="wk"></td><td class="no-print"><button class="btn-del"><i class="fa-solid fa-trash-can"></i></button></td>`;
  tb.appendChild(tr); renum();
}

// ─── Init Non-Effective ───
function initNonEff(){
  const tb=$("#tblNonEff tbody"); tb.innerHTML="";
  DEFAULT_NON_EFF.forEach(d=>_addNonEffRow(tb,d.t,d.w));
  calc();
}
function addNonEffRow(){ _addNonEffRow($("#tblNonEff tbody"),"",1); calc(); }
function _addNonEffRow(tb,t,w){
  const tr=document.createElement("tr");
  tr.innerHTML=`<td class="rn"></td><td><input value="${t}" placeholder="Kegiatan"></td><td><input type="number" value="${w}" min="0" class="ne"></td><td class="no-print"><button class="btn-del"><i class="fa-solid fa-trash-can"></i></button></td>`;
  tb.appendChild(tr); renum();
}

// ─── PROTA ───
function initProta(){
  const tb=$("#tblProta tbody"); tb.innerHTML="";
  _addProtaRow(tb,"Ganjil","Memahami konsep bilangan dan operasinya",12,"");
  _addProtaRow(tb,"Ganjil","Menganalisis pola bilangan",10,"");
  _addProtaRow(tb,"Genap","Memahami konsep geometri dasar",16,"");
  calc();
}
function addProtaRow(){ _addProtaRow($("#tblProta tbody"),"Ganjil","",0,""); calc(); }
function _addProtaRow(tb,sem,tp,jp,ket){
  const tr=document.createElement("tr");
  tr.innerHTML=`<td class="rn"></td><td><select class="ps"><option ${sem==="Ganjil"?"selected":""}>Ganjil</option><option ${sem==="Genap"?"selected":""}>Genap</option></select></td><td><textarea placeholder="Tujuan Pembelajaran...">${tp}</textarea></td><td><input type="number" value="${jp}" min="0" class="pjp"></td><td><input value="${ket}" placeholder="Ket"></td><td class="no-print"><button class="btn-del"><i class="fa-solid fa-trash-can"></i></button></td>`;
  tb.appendChild(tr); renum();
}

// ─── PROMES ───
function buildPromesHeader(){
  const sem=val("#semester");
  const months=sem==="Ganjil"?MONTHS_GANJIL:MONTHS_GENAP;
  let r1=`<tr><th rowspan="2">No</th><th rowspan="2">Tujuan Pembelajaran</th><th rowspan="2">JP</th>`;
  let r2=`<tr>`;
  months.forEach(m=>{ r1+=`<th colspan="5">${m}</th>`; for(let i=1;i<=5;i++) r2+=`<th>${i}</th>`; });
  r1+=`<th rowspan="2">Ket</th><th rowspan="2" class="no-print">Aksi</th></tr>`;
  r2+=`</tr>`;
  $("#thPromes").innerHTML=r1+r2;
}
function initPromes(){
  const tb=$("#tblPromes tbody"); tb.innerHTML="";
  _addPromesRow(tb,"Memahami konsep bilangan",12,"");
  _addPromesRow(tb,"Menganalisis pola bilangan",10,"");
  calc();
}
function addPromesRow(){ _addPromesRow($("#tblPromes tbody"),"",0,""); calc(); }
function _addPromesRow(tb,tp,jp,ket){
  const tr=document.createElement("tr");
  let cells=`<td class="rn"></td><td><textarea placeholder="TP...">${tp}</textarea></td><td><input type="number" value="${jp}" min="0" class="pmjp"></td>`;
  for(let i=0;i<30;i++) cells+=`<td><input maxlength="2" class="wc"></td>`;
  cells+=`<td><input value="${ket}" placeholder="..."></td><td class="no-print"><button class="btn-del"><i class="fa-solid fa-trash-can"></i></button></td>`;
  tr.innerHTML=cells; tb.appendChild(tr); renum();
}
function resetPromesBody(){
  const tb=$("#tblPromes tbody"); tb.innerHTML="";
  _addPromesRow(tb,"",0,""); calc();
}

// ─── Renum all tables ───
function renum(){
  ["tblMonth","tblNonEff","tblProta","tblPromes"].forEach(id=>{
    const rows=$(`#${id} tbody`)?.querySelectorAll("tr");
    if(rows) rows.forEach((r,i)=>{ const c=r.querySelector(".rn"); if(c) c.textContent=i+1; });
  });
}

// ─── Calculate everything ───
function calc(){
  // RPE
  let totW=0; $$("#tblMonth .wk").forEach(i=>totW+=+i.value||0);
  let totN=0; $$("#tblNonEff .ne").forEach(i=>totN+=+i.value||0);
  let eff=Math.max(totW-totN,0);
  let jp=+val("#jpPerMinggu")||0;
  let totJP=eff*jp;
  $("#ftTotalMinggu").textContent=totW;
  $("#ftTotalNonEff").textContent=totN;
  $("#sTotalMinggu").textContent=totW;
  $("#sTotalNonEff").textContent=totN;
  $("#sTotalEff").textContent=eff;
  $("#jpFormula").textContent=`${eff} × ${jp} =`;
  $("#jpTotal").textContent=totJP;

  // Prota
  let pjp=0; $$("#tblProta .pjp").forEach(i=>pjp+=+i.value||0);
  $("#ftProtaJp").textContent=pjp;

  // Promes
  let pmjp=0; $$("#tblPromes .pmjp").forEach(i=>pmjp+=+i.value||0);
  $("#ftPromesJp").textContent=pmjp;
}

// ─── Tab-specific titles ───
const TAB_TITLES = {
  rpe:   "Rencana Pekan Efektif",
  prota: "Program Tahunan",
  promes:"Program Semester"
};

// ─── Sync dynamic values into DOM so they appear in print/export ───
function syncForPrint(){
  $$("input").forEach(i=>i.setAttribute("value",i.value));
  $$("textarea").forEach(t=>t.textContent=t.value);
  $$("select").forEach(s=>{
    [...s.options].forEach(o=>o.removeAttribute("selected"));
    if(s.options[s.selectedIndex]) s.options[s.selectedIndex].setAttribute("selected","selected");
  });

  // Fill TTD print area
  const kota      = val("#kota") || "..................";
  const tglRaw    = val("#tglTtd");
  const namaKS    = val("#namaKepsek") || "........................................";
  const nipKS     = val("#nipKepsek") ? "NIP. " + val("#nipKepsek") : "NIP. ..................";
  const namaGuru  = val("#namaGuru") || "........................................";
  const nipGuru   = val("#nipGuru") ? "NIP. " + val("#nipGuru") : "NIP. ..................";

  let tglFormatted = ".................... 20...";
  if(tglRaw){
    const d=new Date(tglRaw);
    const bulanNama=["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    tglFormatted=`${d.getDate()} ${bulanNama[d.getMonth()]} ${d.getFullYear()}`;
  }

  $("#printKotaTanggal").textContent = `${kota}, ${tglFormatted}`;
  $("#printKepsek").textContent = namaKS;
  $("#printNipKepsek").textContent = nipKS;
  $("#printGuru").textContent = namaGuru;
  $("#printNipGuru").textContent = nipGuru;
}

// ─── Track print mode ───
let _printMode = null; // 'single', 'all', or null

// ─── Print single tab as PDF ───
function printTab(tabId){
  syncForPrint();
  _printMode = 'single';

  $$(".tab-content").forEach(tc=>{
    tc.style.display = tc.id === `tab-${tabId}` ? "block" : "none";
  });
  $(".topbar-left span").textContent = TAB_TITLES[tabId] || "Dokumen";

  window.print();
}

// ─── Print ALL tabs as PDF (each on own page) ───
function printAll(){
  syncForPrint();
  _printMode = 'all';

  // Show all tabs
  $$(".tab-content").forEach(tc=>{
    tc.style.display = "block";
    tc.classList.add("print-page");
  });
  $(".topbar-left span").textContent = "Administrasi Guru";

  window.print();
}

window.addEventListener("beforeprint",()=>{
  syncForPrint();
  // If user presses Ctrl+P without clicking our buttons, show active tab
  if(!_printMode){
    _printMode = 'single';
    $$(".tab-content").forEach(tc=>{
      tc.style.display = tc.classList.contains("active") ? "block" : "none";
    });
    const activeId = document.querySelector(".tab-btn.active")?.dataset.tab || "rpe";
    $(".topbar-left span").textContent = TAB_TITLES[activeId] || "Dokumen";
  }
});

window.addEventListener("afterprint",()=>{
  // Restore normal view
  $$(".tab-content").forEach(tc=>{
    tc.style.display = tc.classList.contains("active") ? "block" : "none";
    tc.classList.remove("print-page");
  });
  $(".topbar-left span").textContent = "Administrasi Guru";
  _printMode = null;
});

// ─── Build a standalone page HTML for one tab (for Word) ───
function buildTabHtml(clone, tabId, identityHtml, ttdHtml){
  const tab = clone.querySelector(`#tab-${tabId}`);
  if(!tab) return "";
  // Get inner content of the tab
  const title = TAB_TITLES[tabId] || "";
  return `
    <div style="page-break-before:always;"></div>
    <h2 style="font-size:14pt;border-bottom:2px solid #000;padding-bottom:6px;margin-bottom:12px;">${title}</h2>
    ${identityHtml}
    ${tab.innerHTML}
    ${ttdHtml}
  `;
}

// ─── Export single tab to Word ───
function exportWord(tabId){
  syncForPrint();

  const clone = $("#app").cloneNode(true);
  cleanCloneForWord(clone);

  // Show only requested tab
  clone.querySelectorAll(".tab-content").forEach(tc=>{
    tc.style.display = tc.id === `tab-${tabId}` ? "block" : "none";
  });
  const topbarSpan = clone.querySelector(".topbar-left span");
  if(topbarSpan) topbarSpan.textContent = TAB_TITLES[tabId] || "Dokumen";

  downloadWord(clone.innerHTML, TAB_TITLES[tabId] || "Dokumen");
}

// ─── Export ALL tabs to Word (each on own page) ───
function exportWordAll(){
  syncForPrint();

  // Build identity section
  const identityClone = $("#identityCard").cloneNode(true);
  replaceFormElements(identityClone);
  const identityHtml = identityClone.outerHTML;

  // Build TTD section
  const ttdClone = $("#ttdSection").cloneNode(true);
  ttdClone.querySelectorAll(".no-print").forEach(el=>el.remove());
  ttdClone.querySelectorAll(".only-print").forEach(el=>el.style.display="flex");
  replaceFormElements(ttdClone);
  const ttdHtml = ttdClone.outerHTML;

  // Build each tab page
  const allClone = $("#app").cloneNode(true);
  cleanCloneForWord(allClone);

  let pages = "";
  ["rpe","prota","promes"].forEach((tabId, idx)=>{
    const tab = allClone.querySelector(`#tab-${tabId}`);
    if(!tab) return;
    const pageBreak = idx > 0 ? '<div style="page-break-before:always;"></div>' : '';
    pages += `
      ${pageBreak}
      <h2 style="font-size:14pt;border-bottom:2px solid #000;padding-bottom:6px;margin-bottom:12px;">${TAB_TITLES[tabId]}</h2>
      ${identityHtml}
      ${tab.innerHTML}
      ${ttdHtml}
    `;
  });

  downloadWord(pages, "RPE_PROTA_PROMES_Lengkap");
}

// ─── Helper: clean clone for Word export ───
function cleanCloneForWord(clone){
  clone.querySelectorAll(".no-print").forEach(el=>el.remove());
  clone.querySelectorAll(".only-print").forEach(el=>el.style.display="flex");
  clone.querySelectorAll(".btn-del,.btn-add,.export-bar").forEach(el=>el.remove());
  replaceFormElements(clone);
}

function replaceFormElements(container){
  container.querySelectorAll("input, textarea").forEach(el=>{
    const span = document.createElement("span");
    span.style.fontWeight="600";
    span.textContent = el.value || el.getAttribute("value") || "";
    el.replaceWith(span);
  });
  container.querySelectorAll("select").forEach(el=>{
    const span = document.createElement("span");
    span.style.fontWeight="600";
    span.textContent = el.options[el.selectedIndex]?.text || "";
    el.replaceWith(span);
  });
}

// ─── Helper: download as Word ───
function downloadWord(bodyHtml, filename){
  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="utf-8">
    <style>
      @page { size: A4 landscape; margin: 1.5cm; }
      body { font-family: Arial, sans-serif; font-size: 11pt; color: #000; }
      table { border-collapse: collapse; width: 100%; margin-bottom: 12px; }
      th, td { border: 1px solid #000; padding: 4px 6px; }
      th { background: #e9ecef; font-weight: 700; }
      .card { margin-bottom: 16px; }
      .card-title { font-size: 12pt; font-weight: 700; margin-bottom: 8px; }
      .summary-grid, .jp-box { margin: 10px 0; padding: 10px; text-align: center; }
      .jp-box { border: 2px solid #000; font-size: 12pt; }
      .jp-box strong { font-size: 18pt; }
      .ttd-print { display: flex; justify-content: space-between; margin-top: 30px; }
      .ttd-col { text-align: center; width: 45%; }
      .ttd-space { height: 80px; }
      .ttd-name { font-weight: 700; text-decoration: underline; }
      .sbox { display: inline-block; border: 1px solid #000; padding: 10px 15px; margin: 5px; text-align: center; }
      .sop { display: inline-block; font-size: 18pt; font-weight: 700; padding: 0 5px; }
      .form-grid { margin-bottom: 10px; }
      .fg label { font-weight: 600; color: #666; font-size: 9pt; }
    </style></head>
    <body>${bodyHtml}</body></html>`;

  const blob = new Blob(['\ufeff'+htmlContent], {type:'application/msword'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href=url;
  a.download = `${filename.replace(/\s+/g,"_")}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}


