import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs";

                        import { PDFDocument } from "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm";

                        pdfjsLib.GlobalWorkerOptions.workerSrc =
                            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";
                        async function Save() {
                            const input = document.querySelector("#File");
                            const file = input.files[0];
                            
                            if(!file){
                                alert("Please select file first");
                                return 0;
                            }
                            
                            const orig = (file.size/1024).toFixed(2);
                            let original = document.querySelector(".original");
                            original.innerHTML = `Original Size: ${orig}Kb`;
                            
                            if(orig<1000||orig>15000){
                                alert("File size is less than 1MB or greater than 10MB");
                                return 0;
                            }
                           
                            let loading = document.querySelector(".loading");
                            loading.innerHTML = "Compressor is working..."
                    
                            const Binary = await file.arrayBuffer();
                            const Binary1Loader = await pdfjsLib.getDocument({
                                data: Binary
                            }).promise;

                            const NewPDF  = await PDFDocument.create();

                            for (let i = 1; i <= Binary1Loader.numPages; i++) {
                                const Pages = await Binary1Loader.getPage(i);
                                console.log(Pages);

                                const Viewport = Pages.getViewport({
                                    scale: 1.5
                                });

                                //Canvas1
                                const canvas1 = document.createElement("canvas");
                                const Brush = canvas1.getContext("2d");

                                canvas1.width = Viewport.width;
                                canvas1.height = Viewport.height;

                                await Pages.render({
                                    canvasContext: Brush,
                                    viewport: Viewport
                                }).promise;

                                const canvas2 = document.createElement("canvas");
                                const Brush2 = canvas2.getContext("2d");

                                canvas2.width = canvas1.width * 0.8;
                                canvas2.height = canvas1.height * 0.8;

                                Brush2.drawImage(canvas1, 0, 0, canvas2.width, canvas2.height);
                                const JPEGFile = canvas2.toDataURL("image/jpeg", 0.6);

                                const imageBytes = await fetch(JPEGFile)
                                .then(response => response.arrayBuffer());

                                const image = await NewPDF.embedJpg(imageBytes);
                                const page = NewPDF.addPage([
                                image.width,
                                image.height
                                ]);
           
                                page.drawImage(image,{
                                x:0,
                                y:0,
                                width:image.width,
                                height:image.height
                                });
           
           
                                }
                                const pdfBytes = await NewPDF.save();
                
                                const blob = new Blob([pdfBytes],{
                                type:"application/pdf"
                                });
                            
                                let comp = (blob.size/1024).toFixed(2);
                                let compress = document.querySelector(".compress");
                                compress.innerHTML = `Compressed Size: ${comp}Kb`;
                                
                                //let loading = document.querySelector(".loading");
                                    loading.innerHTML = "PDF has compressed";
                            
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = "Compressed.pdf";
                                a.click();
                                }
                                window.Save = Save;
