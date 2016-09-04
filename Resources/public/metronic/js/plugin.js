$(document).ready(function(){
    /* 删除标准提示 */
    $('.delete-link').confirmation({
        title: '您确定删除吗？',
        btnOkLabel: '删除',
        btnOkIcon: '',
        btnCancelLabel: '取消',
        btnCancelIcon: '',
        onConfirm: function(event) {
            var did = this.did;

            $('#delete_form_hidden_'+did).submit();
        }
    });

    /* summer note 编辑器 */
    $('.summernote-full').summernote({
        height: 150,
        lang: 'zh-CN',
        fontSizes: ['8', '9', '10', '11', '12', '14', '16', '18', '24', '32', '64'],
        styleTags: ['p', 'blockquote', 'h1', 'h4'],
		toolbar: [
			['parastyle', ['style']],
			['style', ['bold', 'italic', 'underline', 'clear']],
			['fontsize', ['fontsize']],
			['fontcolor', ['color']],
			['para', ['ul', 'ol', 'paragraph']],
            ['insert', ['table', 'link', 'picture']],
			['height', ['height']],
			['misc', ['undo', 'redo', 'fullscreen', 'help']],
		]
    });
    $('.summernote-simple').summernote({
        height: 150,
        lang: 'zh-CN',
        fontSizes: ['8', '9', '10', '11', '12', '14', '16', '18', '24', '32', '64'],
		toolbar: [
			['style', ['bold', 'italic', 'underline' ]],
			['fontsize', ['fontsize']],
			['fontcolor', ['color']],
			['misc', ['fullscreen']],
		]
    });

    $('.editable').editable({
        success: function(response, newValue) {
            if(response.status == 'error') return response.msg; //msg will be shown in editable form
        }
    })

    if( $.isFunction($.fn.audioplayer) ){  
        $('.audioplayer').audioplayer();
    }  
});
