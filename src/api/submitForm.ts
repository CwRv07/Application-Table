import axios from 'axios'
import { ElMessage } from 'element-plus'
import { baseURL } from '.'

export interface submitFormProps {
  name: string
  sex: string
  id: string
  province: string
  city: string
  phoneNumber: string
  qq: string
  email: string
  year: string
  college: string
  major: string
  math: string
  english: string
  ifReferrer: string
  aim: string
  modeling: string
  q1: string
  q2: string
  q3: string
  q4: string
  q5: string
  q6: string
  q7: string
}

const submitForm = (props: submitFormProps) => {
  return new Promise((resolve, reject) => {
    axios.post(baseURL + `/submit`, { ...props }).then(resolve, reject)
  }).catch((err) => {
    ElMessage.error('服务器繁忙，请稍后再试')
  })
}
export default submitForm
