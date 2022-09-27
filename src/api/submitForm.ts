import axios from 'axios'
import { ElMessage } from 'element-plus'
import { baseURL } from '.'
import qs from 'qs'

export interface submitFormProps {
  name: string
  sex: string
  id: string
  province: string
  city: string
  phone_number: string
  qq: string
  email: string
  year: string
  college: string
  major: string
  math: string
  english: string
  if_referrer: string
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
    axios
      .post(baseURL + `/submit`, qs.stringify(props), {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      })
      .then(resolve, reject)
  }).catch((err) => {
    ElMessage.error('服务器繁忙，请稍后再试')
  })
}
export default submitForm
