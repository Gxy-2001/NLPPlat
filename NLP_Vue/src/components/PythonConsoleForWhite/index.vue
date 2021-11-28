<template>
  <div class="python-editor">
    <textarea ref="textarea" />
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
// language
import 'codemirror/mode/python/python.js'
// theme css
import 'codemirror/theme/base16-light.css'
import 'codemirror/theme/ttcn.css'
import 'codemirror/theme/neo.css'

import 'codemirror/addon/lint/lint.css'
import 'codemirror/theme/rubyblue.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'
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
      mode: 'python',
      theme: 'neo',
      gutters: ['CodeMirror-lint-markers'],
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

  ::v-deep {
    .CodeMirror {
      height: auto;
      min-height: 300px;
      max-height: 450px;
    }

    .CodeMirror-scroll {
      min-height: 300px;
      max-height: 450px;
    }

    .cm-s-rubyblue span.cm-string {
      color: #F08047;
    }
  }
}
</style>
