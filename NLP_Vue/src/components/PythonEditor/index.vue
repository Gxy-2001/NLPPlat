<template>
  <div class="python-editor">
    <textarea ref="textarea" />
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'

// 语言
import 'codemirror/mode/python/python.js'

// 主题
import 'codemirror/theme/panda-syntax.css'
import 'codemirror/theme/duotone-light.css'
import 'codemirror/theme/rubyblue.css'
import 'codemirror/theme/idea.css'

// 代码折叠
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/indent-fold.js'
import 'codemirror/addon/fold/comment-fold.js'

// 快捷键风格
import 'codemirror/keymap/sublime.js'

// 匹配
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/edit/matchbrackets.js'

// 选中行
import 'codemirror/addon/selection/active-line.js'

import 'codemirror/addon/comment/comment.js'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/lint.css'

import 'codemirror/keymap/sublime.js'

require('script-loader!jsonlint')

export default {
  name: 'PythonEditor',
  /* eslint-disable vue/require-prop-types */
  props: ['value'],
  data() {
    return {
      pythonEditor: false
    }
  },
  watch: {
    value(value) {
      const editorValue = this.pythonEditor.getValue()
      if (value !== editorValue) {
        this.pythonEditor.setValue(value)
      }
    }
  },
  mounted() {
    this.pythonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      mode: 'python', // 语言
      theme: 'idea', // 主题
      // theme: 'duotone-light',
      // 在行槽中添加行号显示器、折叠器、语法检测器
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
      autofocus: true, // 自动聚焦
      foldGutter: true, // 启用行槽中的代码折叠
      keyMap: 'sublime', // 快键键风格
      lineNumbers: true, // 显示行号
      smartIndent: true, // 智能缩进
      indentUnit: 4, // 智能缩进单位为4个空格长度
      indentWithTabs: true, // 使用制表符进行智能缩进
      lineWrapping: true,
      matchBrackets: true, // 匹配结束符号，比如"]、}"
      autoCloseBrackets: true, // 自动闭合符号
      // styleActiveLine: true, // 显示选中行的样式
      lint: true
    })

    this.pythonEditor.setValue(this.value)
    this.pythonEditor.on('change', cm => {
      this.$emit('changed', cm.getValue())
      this.$emit('input', cm.getValue())
    })
  },
  methods: {
    getValue() {
      return this.pythonEditor.getValue()
    }
  }
}
</script>

<style lang="scss" scoped>
.python-editor {
  height: 100%;
  position: relative;
  border:0.5px solid grey;

  ::v-deep {
    .CodeMirror {
      height: auto;
      min-height: 500px;
      max-height: 500px;
    }

    .CodeMirror-scroll {
      min-height: 500px;
      max-height: 500px;
    }

    .cm-s-rubyblue span.cm-string {
      color: #F08047;
    }
  }
}
</style>
