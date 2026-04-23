import * as pdfjsLib from 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.269/pdf.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.269/pdf.worker.min.mjs';

document.querySelector('canvas').style.display = 'none'
document.querySelector('.page-info').style.display = 'none'

const canvas = document.querySelector('#pdf-render'),
    ctx = canvas.getContext('2d')
let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null,
    scale = 1.5
function renderPage(num)  {
    pageIsRendering = true
    pdfDoc.getPage(num).then(page =>{
        const viewport = page.getViewport({scale})
        canvas.height = viewport.height
        canvas.width = viewport.width

        const renderCtx = {
            canvasContext:ctx,
            viewport
        }
        page.render(renderCtx).promise.then(()=>{
            pageIsRendering=false

            if(pageNumIsPending != null){
                renderPage(pageNumIsPending)
                pageNumIsPending=null
            }
        })
        document.querySelector('#page-num').textContent = num
    })
}
const queueRenerPage = num =>{
    if (pageIsRendering){
        pageNumIsPending = num
    } else{
        renderPage(num)
    }
}
const showPrevPage = () =>{
    if (pageNum<=1){
        return
    }
    else {
        pageNum--
        queueRenerPage(pageNum)
    }
}
const showNextPage = () =>{
    if (pageNum>=pdfDoc.numPages){
        return
    }
    else {
        pageNum++
        queueRenerPage(pageNum)
    }
}
const pageScalePlus= () =>{
    scale+=0.5
    queueRenerPage(pageNum)
}

const pageScaleMinus= () =>{
    scale-=0.5
    queueRenerPage(pageNum)
}

const fileInput = document.querySelector('#file-upload');

fileInput.addEventListener('change', (e) => {

    document.querySelector('canvas').style.display = 'block'
    document.querySelector('.page-info').style.display = 'inline'

    const file = e.target.files[0];
    pageNum = 1

    if (file && file.type === 'application/pdf') {
        const reader = new FileReader();

        reader.onload = function() {
            const typedarray = new Uint8Array(this.result);

        pdfjsLib.getDocument(typedarray).promise.then(pdfDoc_ => {
            pdfDoc = pdfDoc_
            document.querySelector('#page-count').textContent = pdfDoc.numPages
            renderPage(pageNum)
        }).catch(err=>{
            const div = document.createElement('div')
            div.className='error'
            div.appendChild(document.createTextNode(err.message))
            document.querySelector('body').insertBefore(div,canvas)
            document.querySelector('.menu-bar').style.display='none'
        })
        };

        reader.readAsArrayBuffer(file);
    } else {
        alert("Please select a valid PDF file.");
    }
});

document.querySelector('#prev-page').addEventListener('click',showPrevPage)
document.querySelector('#next-page').addEventListener('click',showNextPage)
document.addEventListener('keydown', e => {
    if (e.key === '+' || e.key === '=') {
        pageScalePlus();
    }
    else if (e.key === '-') {
        pageScaleMinus();
    }
    else if (e.key === 'ArrowRight') {
        showNextPage();
    }
    else if (e.key === 'ArrowLeft') {
        showPrevPage();
    }
});
