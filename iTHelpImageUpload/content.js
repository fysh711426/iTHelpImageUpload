(function () {
    //產生批次圖片上傳按鈕
    var toolbars = [];
    function bind() {
        //取得所有的 editor-toolbar
        var toolbarList = document.getElementsByClassName('editor-toolbar');
        for (let i = 0; i < toolbarList.length; i++) {
            let toolbar = toolbarList[i];
            toolbars.push(toolbar);

            //產生 input
            var input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('multiple', 'multiple');
            input.setAttribute('accept', 'image/jpeg,image/png');
            input.setAttribute('style', 'display: none');
            input.onchange = async function () {
                //上傳圖片
                var urls = '';
                var form = toolbar.closest('form');
                var token = form.querySelectorAll('input[name="_token"]')[0].value;
                for (var i = 0; i < this.files.length; i++) {
                    var formData = new FormData();
                    formData.append("images[]", this.files[i]);
                    try {
                        var response = await fetch('https://ithelp.ithome.com.tw/api/upload', {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'X-CSRF-TOKEN': token
                            }
                        });
                        var result = await response.json();
                        if (result.status === 'success')
                            urls += '![' + result.url + '](' + result.url + ')\n';
                        else
                            urls += 'error.' + '\n';
                    }
                    catch (err) {
                        urls += 'error.' + '\n';
                    }
                }
                //擴充功能不能讀取網站程式，沒辦法將網址插入編輯視窗
                prompt("使用 Ctrl+C 複製圖片網址", urls);
            }

            //產生按鈕
            var batchBtn = document.createElement('a');
            batchBtn.setAttribute('title', '批次上傳圖片');
            batchBtn.setAttribute('tabindex', '-1');
            batchBtn.setAttribute('class', 'fa fa-files-o');
            batchBtn.onclick = function () {
                input.click();
            }

            //插入 input 和按鈕
            var target = toolbar.getElementsByClassName('fa-upload')[0];
            toolbar.insertBefore(input, target);
            toolbar.insertBefore(batchBtn, target);
        }
    }
    bind();
})();