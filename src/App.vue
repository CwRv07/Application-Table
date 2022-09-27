<script setup lang="ts">
  import { ComputedRef } from 'vue'
  import { Search } from '@element-plus/icons-vue'
  import debounce from '@/utils/debounce'
  import { ElMessage } from 'element-plus'
  import API from '@/api'
  import { submitFormProps } from '@/api/submitForm'
  /* 表格信息数据 */
  const formObjective = ref()
  const formSubjective = ref()
  const form = reactive<Record<string, any>>({
    /* 个人信息 */
    name: '',
    sex: '',
    id: '',
    province: '',
    city: '',
    /* 联系方式 */
    phoneNumber: '',
    qq: '',
    email: '',
    year: '',
    /* 学院信息 */
    college: '',
    major: '',
    /* 申请信息 */
    math: '',
    english: '',
    ifReferrer: '',
    aim: '',
    modeling: '否',
    /* 主观加分项 */
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: '',
    q7: '',
  })

  /* 静态数据 */
  const provinceList = [
    '北京市',
    '天津市',
    '河北省',
    '山西省',
    '辽宁省',
    '上海市',
    '江苏省',
    '浙江省',
    '安徽省',
    '福建省',
    '江西省',
    '山东省',
    '河南省',
    '湖北省',
    '湖南省',
    '广东省',
    '广西壮族自治区',
    '重庆市',
    '四川省',
    '贵州省',
    '陕西省',
    '甘肃省',
    '香港特别行政区',
    '澳门特别行政区',
  ]
  const collegeList = [
    '信息科学技术学院',
    '东方科技学院',
    '理学院',
    '工学院',
    '资源环境学院',
    '农学院',
    '园艺园林学院',
    '植物保护学院',
    '动物科学技术学院',
    '动物医学院',
    '食品科学技术学院',
    '经济学院',
    '商学院',
    '公共管理与法学学院',
    '马克思主义学院',
    '外国语学院',
    '教育学院',
    '生物科学技术学院',
    '体育艺术学院',
    '国际学院',
    '继续教育学院',
    '其他',
  ]
  const problemList = reactive([
    {
      prop: 'q1',
      label:
        '用自己的话描述CSECL实验室是干什么的（尤其是自己报的方向）？以及自己打算如何在实验室学习？',
    },
    { prop: 'q2', label: '简单谈谈你一年内的规划？能否在实验室待满12个月？' },
    { prop: 'q3', label: '你曾坚持最久的事？坚持多久了？' },
    { prop: 'q4', label: '介绍一下自己和取得过的成就 ？' },
    { prop: 'q5', label: '对于现状你哪些方面需要加强？' },
    { prop: 'q6', label: '你觉得我们为什么会录取你？' },
    {
      prop: 'q7',
      label: '说一说你对数学建模是在做什么的理解？',
      condition: computed(() => form.modeling === '是'),
    },
  ])

  /* 表单验证 */
  const rules = reactive({
    name: [
      {
        required: true,
        message: '来者何人，报上名来',
      },
      {
        min: 2,
        max: 8,
        message: '不可输入非法姓名哦',
      },
    ],
    sex: [
      {
        required: true,
        message: '性别里可没有人妖哦',
      },
    ],
    id: [
      {
        required: true,
        message: '学号可是你校园内的唯一标识',
      },
      {
        min: 12,
        max: 12,
        message: '这是你校园卡上的学号哦(12长度)',
      },
    ],
    province: [
      {
        required: true,
        message: '听说你的家乡很美，告诉我呗',
        trigger: 'change',
      },
    ],
    city: [
      {
        required: true,
        message: '听说你的家乡很美，告诉我呗',
      },
    ],
    phoneNumber: [
      {
        required: true,
        message: '有电话才能通知你来面试哦',
      },
      {
        pattern:
          /^(13[0-9]|14[1|4|5|6|7|8|9]|15[0|1|2|3|5|6|7|8|9]|17[2|3|5|6|7|8]|18[0-9]|19[1|8|9])\d{8}$/,
        message: '不要糊弄我了，这格式不对吧',
      },
    ],
    qq: [
      {
        required: true,
        message: 'QQ可是大神们主要社交工具之一',
      },
      {
        pattern: /^[1-9][0-9]{4,10}$/,
        message: '不要糊弄我了，这格式不对吧',
      },
    ],
    email: [
      {
        required: true,
        message: '请务必是常用邮箱',
      },
      {
        type: 'email',
        message: '不要糊弄我了，这格式不对吧',
      },
    ],
    year: [
      {
        required: true,
        message: '年龄信息不可为空哦',
      },
      {
        pattern: /^\d{4}$/,
        message: '这里填入学年份哦(比如2022)',
      },
    ],
    college: [
      {
        required: true,
        message: '学院信息不可为空哦',
      },
    ],
    major: [
      {
        required: true,
        message: '专业信息不可为空哦',
      },
    ],
    aim: [
      {
        required: true,
        message: '请选择成为我们一员的职位吧',
      },
    ],
    math: [
      {
        required: true,
        message: '数学逻辑对编程开发很重要哦',
      },
      {
        pattern: /^\d{1,3}$/,
        message: '不要糊弄我了，这格式不对吧',
      },
    ],
    english: [
      {
        required: true,
        message: '英语可以决定你在未来的上限哦',
      },
      {
        pattern: /^\d{1,3}$/,
        message: '不要糊弄我了，这格式不对吧',
      },
    ],
    q1: [
      {
        required: true,
        message: '这可是重要的加分项诶，不能丢',
      },
    ],
    q2: [
      {
        required: true,
        message: '这可是重要的加分项诶，不能丢',
      },
    ],
    q3: [
      {
        required: true,
        message: '这可是重要的加分项诶，不能丢',
      },
    ],
    q4: [
      {
        required: true,
        message: '这可是重要的加分项诶，不能丢',
      },
    ],
    q5: [
      {
        required: true,
        message: '这可是重要的加分项诶，不能丢',
      },
    ],
    q6: [
      {
        required: true,
        message: '这可是重要的加分项诶，不能丢',
      },
    ],
  })
  const validate = debounce(
    (props: string, isValid: boolean) => {
      if (isValid === requestProps[props]) return
      let completeNum = 0
      requestProps[props] = isValid
      for (const key in requestProps) {
        requestProps[key] && completeNum++
      }
      progress.curr = completeNum
    },
    500,
    {
      callback: (oldArgs: any, newArgs: any) =>
        oldArgs && oldArgs[0] === newArgs[0],
    }
  )

  /* 表单提交 */
  const scrollToProp = (message = false) => {
    for (const key in requestProps) {
      if (form[key] == null || form[key] == '') {
        ElMessage.error(`已帮你滚动到目标输入框(请补全信息)`)
        formObjective.value.scrollToField(key)
        formSubjective.value.scrollToField(key)
        formObjective.value.validateField(key)
        formSubjective.value.validateField(key)
        return false
      }
    }
    message && ElMessage.success(`信息已经填完咯，快提交吧`)
    return true
  }
  const submit = async () => {
    /* 基础信息检测 */
    if (scrollToProp()) {
      const props: submitFormProps = {
        name: form.name,
        sex: form.sex,
        id: form.id,
        province: form.province,
        city: form.city,
        phoneNumber: form.phoneNumber,
        qq: form.qq,
        email: form.email,
        year: form.year,
        college: form.college,
        major: form.major,
        math: form.math,
        english: form.english,
        ifReferrer: form.ifReferrer,
        aim: form.aim,
        modeling: form.modeling,
        q1: form.q1,
        q2: form.q2,
        q3: form.q3,
        q4: form.q4,
        q5: form.q5,
        q6: form.q6,
        q7: form.q7,
      }
      const res = await API.submitForm(props)
      if (res) {
        ElMessage.success(`提交成功`)
      }
      hasFinish.value = true
    }
  }

  /* 表单进度数据 */
  const requestProps: Record<string, boolean> = {
    name: false,
    sex: false,
    id: false,
    province: false,
    city: false,
    phoneNumber: false,
    qq: false,
    email: false,
    year: false,
    college: false,
    major: false,
    math: false,
    english: false,
    aim: false,
    q1: false,
    q2: false,
    q3: false,
    q4: false,
    q5: false,
    q6: false,
  }
  const isComplete: ComputedRef<boolean> = computed(
    () => progress.curr == progress.total
  )

  const progress = reactive({
    curr: 0,
    total: Object.getOwnPropertyNames(requestProps).length,
    isComplete,
  })

  /* 响应式js判断 */
  const isPhone = computed(() => window.innerWidth < 768)
  /* 滚动至表单 */
  const scrollToTable = () => {
    document.querySelector('#table-body')?.scrollIntoView()
  }
  /* 文本特效 */
  onMounted(() => {
    const titleEl = document.querySelector('.table-title') as HTMLElement
    const total =
      (document.querySelector('#table-body') as HTMLElement).offsetTop - 200
    window.addEventListener('scroll', () => {
      if (document.documentElement.scrollTop <= total) {
        requestAnimationFrame(() => {
          const ratio = +(document.documentElement.scrollTop / total).toFixed(2)
          titleEl.style.transform = `scale(${ratio + 1})`
          titleEl.style.opacity = `${1 - ratio}`
        })
      }
    })
  })
  /* 弹窗控制 发展方向介绍 */
  type aimInfoType = {
    title: string
    list: string[]
  }
  const dialog = reactive({
    isShow: false,
    title: '',
    message: { title: '', list: [] as string[] },
    cancel: () => {
      if (dialog.title === '数学建模') {
        form.modeling = false
      } else {
        form.aim = ''
      }
      dialog.isShow = false
    },
    enter: () => {
      if (dialog.title === '数学建模') {
        form.modeling = '是'
      } else {
        form.aim = dialog.title
      }
      dialog.isShow = false
    },
  })
  const aimInfo: Record<string, aimInfoType> = {
    前端: {
      title:
        '前端主要负责数据的展示和交互，我们使用的浏览器、小程序、app的界面都是前端制作的',
      list: [
        `1、熟悉前端三件套：HTML、CSS、JavaScript，轻松编写静态页面。`,
        `2、掌握UI框架：BootStrap、ElementPlus/Ant-Design；掌握JS框架：Vue/React。`,
        `3、熟悉AJAX/Fetch，学会前后端交互实现动态网页。`,
        `4、掌握node.js。`,
        `5、了解MySQL、以及一门后端编程语言，了解后端事务和流程。`,
      ],
    },
    后端: {
      title:
        '专注Linux/Windows系统、Apache服务器、python语言、MySQL数据库的建设、数据获取分析处理',
      list: [
        `1.掌握一定的前端基础知识：HTML、CSS、JavaScript、Ajax等。`,
        `2、熟悉相关网络协议：HTTP协议，TCP/IP协议。`,
        `3、了解后端语言，例如java，python（python相对合适于数据处理的操作）`,
        `4、熟悉关系型数据库MySQL，非关系型NoSQL，学会数据库设计思想，熟练数据库语句及数据库的优化配置。`,
        `5、熟练服务器Apache Nginx的相关配置且应用Linux、 Windows操作系统。`,
      ],
    },
    数学建模: {
      title: '数学建模是基于现实问题构建数学模型，并且使用算法对问题进行求解',
      list: [
        `简单的例子：高中的线性回归方程`,
        `1、语言方面可以学习matlab和python，R语言也可以，python相比matlab和R语言，python的适用范围广，简单来说就是python学了还能做除了数学建模以外的事，matlab和R语言就专注于数据`,
        `2、了解一些数据分析的基本方法`,
        `3、学习一些机器学习的相关内容（线性回归方程就是一种最基础的机器学习）`,
      ],
    },
  }
  const checkAim = (value: any) => {
    if (value === '是' || value === '否') {
      value = '数学建模'
      form.modeling = '否'
    } else {
      form.aim = ''
    }
    dialog.title = value
    dialog.message = aimInfo[value]
    dialog.isShow = true
  }
  /* 表单提交成功响应 */
  const hasFinish = ref(false)
</script>

<template>
  <div id="table" v-if="!hasFinish">
    <header id="header">
      <section class="table-title">
        <h1>
          互 联 网 创 新
          <br v-if="isPhone" />
          实 验 室
          <br />
          报 名 申 请
        </h1>
      </section>
      <section class="arrow" @click="scrollToTable"></section>
    </header>
    <main id="table-body">
      <section class="table-main">
        <el-form
          ref="formObjective"
          :model="form"
          label-position="right"
          :rules="(rules as Record<string,any>)"
          label-width="65px"
          status-icon
          @validate="validate"
        >
          <!-- 个人信息 -->
          <el-row :gutter="20" class="table-section">
            <p class="section-title">个人信息</p>
            <el-col :sm="12" :xs="24">
              <el-form-item prop="name" label="姓名" required>
                <el-input class="table-name" v-model="form.name" error="123" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item prop="id" label="学号" required>
                <el-input v-model="form.id" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="sex" label="性别" required>
                <el-radio-group v-model="form.sex">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item prop="province" label="省份" required>
                <el-select v-model="form.province" filterable placeholder=" ">
                  <el-option
                    v-for="item in provinceList"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item prop="city" label="市区" required>
                <el-input v-model="form.city" />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 联系方式 -->
          <el-row :gutter="20" class="table-section">
            <p class="section-title">联系方式</p>
            <el-col :sm="12" :xs="24">
              <el-form-item prop="phoneNumber" label="手机号" required>
                <el-input type="tel" v-model="form.phoneNumber" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item prop="qq" label="QQ" required>
                <el-input v-model="form.qq" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item prop="email" label="邮箱" required>
                <el-input type="email" v-model="form.email" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item prop="year" label="年级" required>
                <el-input v-model="form.year" />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 学院信息 -->
          <el-row :gutter="20" class="table-section">
            <p class="section-title">学院信息</p>
            <el-col :sm="12" :xs="24">
              <el-form-item prop="college" label="学院" required>
                <el-select v-model="form.college" filterable placeholder=" ">
                  <el-option
                    v-for="item in collegeList"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item prop="major" label="专业" required>
                <el-input v-model="form.major" />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 申请信息 -->
          <el-row :gutter="20" class="table-section">
            <p class="section-title">申请信息</p>
            <el-col :sm="12" :xs="24">
              <el-form-item
                prop="aim"
                label="发展方向"
                label-width="80px"
                required
              >
                <el-radio-group v-model="form.aim" @change="checkAim">
                  <el-radio label="前端">前端</el-radio>

                  <el-radio label="后端">后端</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item
                prop="modeling"
                label="发展方向(选修)"
                label-width="120px"
              >
                <el-tooltip
                  content="点击查看详情"
                  placement="top"
                  :hide-after="100"
                >
                  <el-checkbox
                    v-model="form.modeling"
                    true-label="是"
                    false-label="否"
                    label="数学建模"
                    @change="checkAim"
                  />
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="ifReferrer" label="推荐人">
                <el-input v-model="form.ifReferrer" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form
          ref="formSubjective"
          :model="form"
          label-position="top"
          :rules="(rules as Record<string,any>)"
          @validate="validate"
        >
          <!-- 主观加分项 -->
          <el-row :gutter="20" class="table-section">
            <p class="section-title">主观加分项</p>
            <el-col :sm="12" :xs="24">
              <el-form-item
                prop="math"
                label="高考数学成绩"
                label-width="80px"
                required
              >
                <el-input v-model="form.math" />
              </el-form-item>
            </el-col>
            <el-col :sm="12" :xs="24">
              <el-form-item
                prop="english"
                label="高考英语成绩"
                label-width="80px"
                required
              >
                <el-input v-model="form.english" />
              </el-form-item>
            </el-col>
            <el-col
              :span="24"
              v-for="problem in problemList"
              :key="problem.prop"
            >
              <el-form-item
                v-show="problem.condition == null || problem.condition"
                :prop="problem.prop"
                :label="problem.label"
              >
                <el-input
                  v-model="form[problem.prop]"
                  type="textarea"
                  :maxlength="200"
                  :autosize="{ minRows: 2 }"
                  show-word-limit
                  resize="none"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </section>
    </main>
    <!-- 提交板块 -->
    <footer id="footer">
      <div class="submit-box">
        <el-row :gutter="10">
          <el-col :span="12" class="submit-progress">
            <el-button
              :type="progress.isComplete ? 'success' : 'danger'"
              :icon="Search"
              text
              @click="scrollToProp(true)"
            >
              完成度 {{ progress.curr }}/{{ progress.total }}
            </el-button>
          </el-col>

          <el-col :span="12" class="submit-button">
            <el-button type="primary" @click="submit">确认提交</el-button>
          </el-col>
        </el-row>
      </div>
    </footer>
    <!-- 弹窗 -->

    <el-dialog
      v-model="dialog.isShow"
      :title="dialog.title"
      :width="isPhone ? '80%' : '50%'"
    >
      <template #default>
        <section class="dialog">
          <p class="dialog-title">{{ dialog.message.title }}</p>
          <ul class="dialog-list">
            <li
              class="dialog-item"
              v-for="item in dialog.message.list"
              :key="item"
            >
              {{ item }}
            </li>
          </ul>
        </section>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialog.cancel">我再考虑下</el-button>
          <el-button type="primary" @click="dialog.enter">
            教练我要学这个
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 页置顶 -->
    <el-backtop :right="50" :bottom="70" />
  </div>
  <div id="status" v-else>
    <el-result icon="success" title="提交成功" sub-title="请耐心等待申请结果" />
  </div>
</template>

<style lang="scss" scoped>
  @use 'element-plus/theme-chalk/dark/css-vars.css';

  #table {
    --rv-gradient-ramp-title: linear-gradient(
      to right,
      #0773ff,
      #1b88ff,
      #18a6fc,
      #10adf1,
      #10d8c1,
      #33e6d1
    );
    --rv-gradient-ramp: linear-gradient(315deg, #18a6fc, #0773ff);
    background-color: var(--el-fill-color);

    /* 页头 */
    #header {
      position: relative;
      align-items: center;
      min-height: 100vh;
      background-color: var(--el-fill-color);
      overflow: hidden;
      user-select: none;

      &:before,
      &:after {
        content: '';
        position: absolute;
        left: 50%;
        min-width: 300vw;
        min-height: 300vw;
        background-color: var(--el-fill-color-darker);
        animation-name: rotate;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
      }

      &:before {
        bottom: 15vh;
        border-radius: 45%;
        animation-duration: 10s;
      }

      &:after {
        bottom: 5vh;
        opacity: 0.5;
        border-radius: 47%;
        animation-duration: 10s;
      }

      @keyframes rotate {
        0% {
          transform: translate(-50%, -5%) rotateZ(0deg);
        }

        50% {
          transform: translate(-50%, -10%) rotateZ(180deg);
        }

        100% {
          transform: translate(-50%, -5%) rotateZ(360deg);
        }
      }

      .table-title {
        width: 90%;
        position: absolute;
        top: 20%;
        left: 0;
        right: 0;
        margin: 0 auto;
        font-size: 65px;
        font-weight: bold;
        text-align: center;
        background: var(--rv-gradient-ramp-title);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        word-spacing: -20px;
        z-index: 10;

        @media (min-width: 768px) {
          word-spacing: 0px;
          font-size: 70px;
        }
      }
    }

    .arrow {
      width: 100px;
      height: 100px;
      position: absolute;
      top: 75%;
      left: 50%;
      animation-name: suspend;
      animation-iteration-count: infinite;
      animation-duration: 5s;
      background-image: url('@/assets/imgs/arrow.svg');
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      transform-origin: center left;
      cursor: pointer;
      opacity: 0.8;
      z-index: 10;

      @media (min-width: 768px) {
        top: 70%;
      }
    }

    @keyframes suspend {
      0%,
      100% {
        transform: rotate(180deg) translateX(-50%) translateY(-10px);
      }

      50% {
        transform: rotate(180deg) translateX(-50%) translateY(10px);
      }
    }
  }

  /* 表单 */
  #table-body {
    display: block;
    padding: 40px 40px 0;
    margin: 0 auto;
    min-width: 250px;
    max-width: 800px;
    color: var(--el-text-color-primary);

    .table-main {
      /* 板块 */
      .table-section {
        position: relative;
        padding: 30px 20px 15px;
        margin-bottom: 50px;
        border-radius: 10px;
        background-color: var(--el-fill-color-light);
        box-shadow: var(--el-box-shadow-light);

        .section-title {
          position: absolute;
          padding: 6px 15px;
          left: -10px;
          top: -10px;
          border-radius: 5px;
          background: var(--rv-gradient-ramp);
          color: white;
          font-weight: bold;
          user-select: none;
        }
      }

      /* 输入框 */
      .el-input,
      .el-select {
        width: 100%;
        max-width: 300px;
      }

      /* 标签 */
      .el-form {
        :deep(.el-form-item__label) {
          font-size: 14px;
          font-weight: bold;
          color: var(--el-text-color-regular);
          user-select: none;
        }
      }
    }
  }

  /* 页尾 */
  #footer {
    position: relative;
    margin-top: -20px;
    padding-bottom: 30px;
    padding-right: 30px;
    background-color: var(--el-fill-color);

    .submit-box {
      min-width: 250px;
      max-width: 850px;
      margin: 0 auto;

      /* 完成度 */
      .submit-progress {
        text-align: right;

        .el-button {
          font-size: 15px;
          font-weight: bold;
          background-color: var(--el-fill-color);
        }
      }

      /* 提交按钮 */
      .submit-button .el-button {
        width: 100%;
        font-size: 15px;
        font-weight: bold;
        letter-spacing: 0.5em;
        background: var(--rv-gradient-ramp);
      }
    }
  }

  /* 弹窗 */
  :deep(.el-dialog__body) {
    padding: 0px 20px;
  }
  .dialog {
    .dialog-title {
      font-weight: bold;
      margin-bottom: 10px;
    }
    .dialog-item {
      margin: 5px 0;
    }
  }
  /* 置顶 */
  .el-backtop {
    box-shadow: var(--el-box-shadow);
  }

  /* 状态 */
  #status {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

<!-- 全局 -->
<style lang="scss">
  html {
    scroll-behavior: smooth;
  }

  //修改滚动条样式
  ::-webkit-scrollbar {
    width: 10px;
    height: 1px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: none;
    background: rgb(217, 217, 217);
    -webkit-box-shadow: none;
    box-shadow: none;

    &:hover {
      background: rgb(168, 168, 168);
    }
  }

  ::-webkit-scrollbar-track {
    background-color: var(--el-fill-color);
  }
</style>
