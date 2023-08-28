// 拥有完整dom权限
window.addEventListener('message', function (event) {
    console.log("盘络上传postMessage监听: " + event.data.type);
    if (event.data.type === 'CodeMirror5') {
        let editorElement = document.querySelector(".CodeMirror");
        if (editorElement) {
            const content = editorElement.CodeMirror.getValue();
            const newContent = content + event.data.data;
            editorElement.CodeMirror.setValue(newContent);
        }
    }
    if (event.data.type === 'Gutenberg') {
        try {
            let Gutenberg = wp.data.dispatch('core/block-editor');
            if (Gutenberg) {
                const imageBlock = wp.blocks.createBlock('core/image', { url: event.data.data });
                Gutenberg.insertBlock(imageBlock);
            }
        } catch (err) {
        }

    }
    if (event.data.type === 'TinyMCE') {
        try {
            let TinyMCEs = tinymce.activeEditor;
            if (TinyMCEs) {
                tinymce.activeEditor.execCommand('mceInsertContent', false, event.data.data);
            }
        } catch (error) {
        }
    }
    if (event.data.type === 'wangeditor') {
        try {
            let wangeditor_Element = editor.getEditableContainer()
            if (wangeditor_Element) {
                editor.dangerouslyInsertHtml(event.data.data)
            }
        } catch (error) {
        }

    }
    if (event.data.type === 'ckeditor') {
        try {
            let ckeditor_Element = Object.values(CKEDITOR.instances)[0];
            if (ckeditor_Element) {
                ckeditor_Element.insertHtml(event.data.data);
            }
            return;
        } catch (error) {
        }
        try {
            let ckeditor_Element = editor;
            if (ckeditor_Element) {
                const content = ckeditor_Element.getData();
                ckeditor_Element.setData(content + event.data.data);
            }
            return;
        } catch (error) {
        }
    }
    if (event.data.type === 'ckeditor4') {
        try {
            let ckeditor_Element = Object.values(CKEDITOR.instances)[0];
            if (ckeditor_Element) {
                ckeditor_Element.insertHtml(event.data.data);
            }
        } catch (error) {
        }

    }
    if (event.data.type === 'ckeditor5') {
        try {
            let ckeditor_Element = editor;
            if (ckeditor_Element) {
                const content = ckeditor_Element.getData();
                ckeditor_Element.setData(content + event.data.data);
            }
        } catch (error) {
        }

    }
    if (event.data.type === 'ueditor') {
        try {
            let ueditor_Element = UE.getEditor("editor_content");
            if (ueditor_Element) {
                ueditor_Element.execCommand('insertimage', {
                    src: event.data.data,
                });
            }
        } catch (error) {
        }

    }
    if (event.data.type === 'phpbbForum') {
        try {
            let phpbbForum = phpbb;
            if (phpbbForum) {
                let phpbbEditor = document.getElementById("message")
                phpbbEditor.value += event.data.data;
            }
        } catch (error) {
        }

    }
    //自动复制
    if (event.data.type === 'AutoCopy') {
        let value = event.data.data;
        // 使用 Clipboard API 复制文本内容到剪贴板
        navigator.clipboard.writeText(value)
            .then(() => {
                console.log("已复制到剪贴板：" + value);
            })
            .catch(error => {
                console.error("复制到剪贴板失败：" + error);
            });
    }
});
function detectEncoding() {
    const charsetMeta = document.querySelector('meta[charset]');
    if (charsetMeta) {
        return charsetMeta.getAttribute('charset').toLowerCase();
    }
    return 'unknown';
}

function FullDomAutoInsert() {
    let item = document.createElement('div');
    item.className = "insertContentIntoEditorPrompt"
    item.innerText = "😍盘络"
    const detectedEncoding = detectEncoding();
    if (detectedEncoding !== 'utf-8') {
        // 不是utf-8
        item.innerText = "PL-Upload"
    }

    let success = false;
    let pageText = document.body.innerText;
    //Discuz
    if (pageText.toLowerCase().includes("discuz") || pageText.toLowerCase().includes("论坛") == true) {
        let DiscuzReply = document.getElementById("fastpostmessage")
        let Discuz_ReplyAdvanced = document.getElementById("e_textarea")
        if (DiscuzReply) {
            let fastpostsubmit = document.getElementById("fastpostsubmit")
            fastpostsubmit.parentNode.appendChild(item)
            success = "Discuz"
        }
        if (Discuz_ReplyAdvanced) {
            Discuz_ReplyAdvanced.parentNode.parentNode.appendChild(item)
            success = "Discuz"
        }

        const supportedImageFormats = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.ico'];
        const topicContentElements = Array.from(document.querySelectorAll('.t_f'));
        ContentElements(topicContentElements);

        function ContentElements(ContentElements) {
            if (ContentElements.length < 1) {
                return;
            }
            for (const replyContent of ContentElements) {
                const text = replyContent.innerHTML;
                const imageLinks = text.match(/https?:\/\/[^\s]+/g) || [];
                //  去除图像链接末尾的任何内容
                const cleanedImageLinks = imageLinks.map(link => link.replace(/(<br>|<\/?[^>]+>)$/, ''));
                console.log(imageLinks);
                console.log(cleanedImageLinks);
                cleanedImageLinks.forEach(link => {
                    if (supportedImageFormats.some(format => link.endsWith(format))) {
                        const imgDiv = document.createElement('div');
                        const imgElement = document.createElement('img');
                        imgDiv.className = "position-relative PL-DiscuzImgMark"
                        imgElement.src = link;
                        imgElement.alt = "盘络转换";
                        imgElement.title = link;
                        imgDiv.appendChild(imgElement);
                        replyContent.appendChild(imgDiv);
                    }
                });
            }
        }


    }
    //v2exReply
    if (pageText.toLowerCase().includes("v2ex")) {
        if (success != false) {
            return success;
        }
        let topic_content = document.getElementById("topic_content")
        if (pageText.toLowerCase().includes("主题创建指南")) {
            if (topic_content) {
                topic_content.parentNode.appendChild(item)
                success = true
            }
        }
        let reply_content = document.getElementById("reply_content")
        if (reply_content) {
            reply_content.parentNode.appendChild(item)
            item.title = "v2ex提示:非imgur图床,未安装用户无法预览"
            success = true
        }
        // url转图片
        const supportedImageFormats = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.ico'];
        const topicContentElements = Array.from(document.querySelectorAll('.topic_content'));
        ContentElements(topicContentElements)
        const replyContentElements = Array.from(document.querySelectorAll('.reply_content'));
        ContentElements(replyContentElements)
        function ContentElements(ContentElements) {
            if (ContentElements.length < 1) {
                return
            }
            for (const replyContent of ContentElements) {
                const anchorElements = Array.from(replyContent.querySelectorAll('a'));
                for (const anchorElement of anchorElements) {
                    const imgElements = Array.from(anchorElement.querySelectorAll('img')); // 获取 <a> 元素内的所有 <img> 元素

                    if (imgElements.length === 0) {
                        const href = anchorElement.getAttribute('href');
                        const lowerCaseHref = href.toLowerCase();

                        if (supportedImageFormats.some(format => lowerCaseHref.endsWith(format))) {
                            anchorElement.innerHTML = `
                        <img class="embedded_image " src="`+ href + `" loading="lazy" alt="盘络转换">
                        `
                            anchorElement.className = "PL-v2exImgMark"
                            anchorElement.style.position = "relative"
                        }
                    }
                }
            }
        }

    }
    //nodeseek
    if (pageText.toLowerCase().includes("nodeseek")) {
        if (success != false) {
            return success;
        }
        let nodeseek = document.getElementById("markdown-input")
        if (nodeseek) {
            nodeseek.parentNode.parentNode.appendChild(item)
            success = "nodeseek"
        }

        const supportedImageFormats = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.ico'];
        const topicContentElements = Array.from(document.querySelectorAll('.post-content'));
        ContentElements(topicContentElements);

        function ContentElements(ContentElements) {
            if (ContentElements.length < 1) {
                return;
            }
            for (const replyContent of ContentElements) {
                const anchorElements = Array.from(replyContent.querySelectorAll('p'));
                for (const anchorElement of anchorElements) {
                    const text = anchorElement.innerHTML;
                    const imageLinks = text.match(/https?:\/\/[^\s]+/g) || [];

                    // 去除图像链接末尾的任何内容
                    const cleanedImageLinks = imageLinks.map(link => link.replace(/(<br>|<\/?[^>]+>)$/, ''));
                    cleanedImageLinks.forEach(link => {
                        if (supportedImageFormats.some(format => link.endsWith(format))) {
                            const imgDiv = document.createElement('div');
                            const imgElement = document.createElement('img');
                            imgDiv.className = "position-relative PL-NodeseekImgMark"
                            imgElement.src = link;
                            imgElement.alt = "盘络转换";
                            imgElement.title = link;
                            imgDiv.appendChild(imgElement);
                            anchorElement.appendChild(imgDiv);
                        }
                    });
                }
            }
        }


    }
    //Xiuno
    if (pageText.toLowerCase().includes("xiuno")) {
        if (success != false) {
            return success;
        }
        if (pageText.toLowerCase().includes("粗体") || pageText.toLowerCase().includes("回帖")) {
            let Xiuno = document.getElementById("message")
            if (Xiuno) {
                Xiuno.parentNode.parentNode.appendChild(item)
                success = "Xiuno"
            }
        }
        if (pageText.toLowerCase().includes("回复") || pageText.toLowerCase().includes("楼主")) {
            item.innerText = "😭盘络"
        }
    }
    //hostevaluate
    if (pageText.toLowerCase().includes("hostevaluate")) {
        if (success != false) {
            return success;
        }
        let new_topic = document.getElementById("new_topic")
        if (new_topic) {
            new_topic.parentNode.appendChild(item)
            success = "hostevaluate"
        }
    }
    //typecho
    if (pageText.toLowerCase().includes("typecho")) {
        if (success != false) {
            return success;
        }
        let Typecho = document.getElementById("btn-submit")
        if (Typecho) {
            Typecho.parentNode.appendChild(item)
            success = "typecho"
        }
    }
    //lowendtalk
    if (pageText.toLowerCase().includes("lowendtalk")) {
        if (success != false) {
            return success;
        }
        let lowendtalkEditor = document.getElementById("Form_Body")
        if (lowendtalkEditor) {
            lowendtalkEditor.parentNode.appendChild(item)
            success = "lowendtalk"
        }
    }
    //CodeMirror Editor
    let editorElement = document.querySelector(".CodeMirror");
    if (editorElement) {
        if (success != false) {
            return success;
        }
        editorElement.parentNode.appendChild(item)
        success = "CodeMirror"
    }
    //Gutenberg Editor
    let Gutenberg = document.getElementById("wpbody-content")
    if (Gutenberg) {
        if (success != false) {
            return success;
        }
        let wpfooter = document.getElementsByClassName("interface-interface-skeleton__footer")
        if (wpfooter.length) {
            wpfooter[wpfooter.length - 1].appendChild(item)
            success = "Gutenberg"
        }

    }
    //halo
    let HaloEditorElement = document.getElementsByClassName("halo-rich-text-editor")
    if (HaloEditorElement.length) {
        if (success != false) {
            return success;
        }
        let HaloEditorHeader = HaloEditorElement[0].querySelector('.editor-header');
        HaloEditorHeader.appendChild(item)
        success = "halo"
    }
    let CodeMirror6 = document.querySelector(".cm-editor");
    if (CodeMirror6) {
        if (success != false) {
            return success;
        }
        CodeMirror6.parentNode.appendChild(item)
        success = "CodeMirror6"
    }
    //tinymce
    try {
        if (success != false) {
            return success;
        }
        let TinyMCE_Elements = tinymce.activeEditor
        if (TinyMCE_Elements) {
            let container = TinyMCE_Elements.getContainer();
            container.appendChild(item)
            success = "tinymce";
        }
    } catch (error) {
    }
    //wangeditor
    try {
        if (success != false) {
            return success;
        }
        let wangeditor_Elements = editor.getEditableContainer()
        if (wangeditor_Elements) {
            wangeditor_Elements.appendChild(item)
            success = "wangeditor";
        }
    } catch (error) {

    }
    //ckeditor 4
    try {
        if (success != false) {
            return success;
        }
        let ckeditor_Elements = Object.values(CKEDITOR.instances)[0];
        let ckeditor_Element_Node = ckeditor_Elements.container.$
        if (ckeditor_Element_Node) {
            ckeditor_Element_Node.appendChild(item)
            success = "ckeditor4";
        }
    } catch (error) {
    }
    //ueditor
    try {
        if (success != false) {
            return success;
        }
        let ueditor_Elements = UE.getEditor("editor_content");
        let ueditor_Elements_Node = ueditor_Elements.container
        if (ueditor_Elements_Node) {
            ueditor_Elements_Node.appendChild(item)
            success = "ueditor";
        }
    } catch (error) {

    }
    // phpbb
    try {
        if (success != false) {
            return success;
        }
        let phpbbForum = phpbb;
        if (phpbbForum) {
            let phpbbEditor = document.getElementById("message").parentElement
            phpbbEditor.appendChild(item)
            success = "phpbb";
        }
    } catch (error) {
    }


    let iframe = document.querySelector('iframe');
    if (iframe) {
        if (success != false) {
            return success;
        }
        let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        let editableElement = iframeDocument.querySelector('[contenteditable="true"]');

        if (editableElement) {
            iframe.parentNode.appendChild(item)
            success = "iframe";
        }
    }
    return success;
}
setTimeout(() => {
    let AutoInsert = FullDomAutoInsert()
    if (AutoInsert != false) {
        window.postMessage({ type: 'insertContentIntoEditorState', data: true }, '*');
    }
}, 800);


