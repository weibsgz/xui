import '@/assets/css/common.scss'
import './index.scss'
import WebUploader from 'webuploader'
import COS from 'cos-js-sdk-v5'
import Message from '../xMessage'
const Uploader = module.exports =  class {
  constructor(option = {}){
    this.option = Object.assign({}, this.defaults(), option)
    this.option.accept.extensions = this.option.extensions
    this.option.accept.mimeTypes = this.option.mimeTypes
    this.uploader = null
    this.Message = new Message()
    const {shortvideoToken, uid} = this.option.uploadVideo
    this._taskId = ''
    this.methods = {
      getBucketInit(successFn){
        //var url = "http://localhost:3031/uploadVideoTXy"
        $.ajax({
          url:shortvideoToken,
          data:{
            uid:uid
          },
          type:'post',
          success:function(re){
            const res = typeof re=== 'string' ?  JSON.parse(re) : re
            const data = res.data
            if(res.errcode != 200){ return}
            const cos = new COS({
              getAuthorization: function (options, callback) {
                callback({
                  TmpSecretId: data.TempCredential.Credentials.TmpSecretId,
                  TmpSecretKey: data.TempCredential.Credentials.TmpSecretKey,
                  XCosSecurityToken: data.TempCredential.Credentials.Token,
                  // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
                  StartTime: data.TempCredential.CreateTime, // 时间戳，单位秒，如：1580000000
                  ExpiredTime: data.TempCredential.ExpiredTime // 时间戳，单位秒，如：1580000900  
                })
              }
            })
            successFn(cos, data)
          },
          error:function(err){}
        })
      }
    }
    this.init()
    this.uploaderEvent()
    return this.uploader
  }
  init(){
    const opts = this.option
    const {beforeUploader, uploaderError} = opts
    let file = ''
    this.uploader  = WebUploader.create(opts)
    this.uploader.on('beforeFileQueued', (File)=>{
      console.log('befror', File)
      file = File
    })
    this.uploader.on('error', (type)=>{
      this.validataType(type)
    })
    this.uploader.on('startUpload', ()=>{
      if(!beforeUploader(file)){
        this.uploader.stop()
        file = ''
        return
      }
      if(this.option.accept.extensions.toLowerCase().includes('mp4')){
        this.uploader.stop()
        this.uploadVideo(file)
        file = ''
      }
    })

    this.uploader.on('uploadProgress', (File, percentage)=>{
      opts.uploadProgress(File, percentage)
    })
    this.uploader.on('uploadError', (File, response)=>{
      uploaderError(File, response)
    })
    this.uploader.on('uploadSuccess', (File, response)=>{
      opts.uploadSuccess(File, response)
    })
  }
  uploadVideo(File){
    const {uploadProgress, uploadSuccess, uploaderError} = this.option
    const {uid} = this.option.uploadVideo
    const {getBucketInit} = this.methods
    //分片上传
    const multipartInit = (cos, initData, fileObject, option)=>{
      const storeInfo = initData.storeInfo
      const _key = storeInfo.file + '.mp4'
      console.log(storeInfo, fileObject, _key)
      cos.sliceUploadFile({
        Bucket: storeInfo.originBucketName, /* 必须 */
        Region: storeInfo.region,     /* 存储桶所在地域，必须字段 */
        Key: _key,              /* 必须 */
        Body: fileObject.source.source,
        Headers: {
          'x-cos-meta-id': storeInfo['x-cos-meta-id']
        },
        onTaskReady(taskId){
          this._taskId = taskId
        },
        onHashProgress(progressData){
          
        },
        onProgress(progressData){
          uploadProgress(fileObject, progressData)
        }
      }, (err, data)=> {
        err && option.error(err, $.extend({}, data, initData, {_key:_key}))
        data && option.success($.extend({}, data, initData, {_key:_key}))
      })
    }
    getBucketInit((cos, data)=>{
      multipartInit(cos, data, File, {
        error(error, initData){
          //errorFn($.extend({}, initData), (data)=>{})
          uploaderError(error, initData)
        },
        success(ndata){
          uploadSuccess(File, {...data, ...ndata})
        }
      })
    })
  }
  uploaderEvent(){
    const opts = this.option
    const {stopBtn} = opts
    if(!stopBtn){
      return
    }
    stopBtn.toggle(()=>{
      stopBtn.html('重新上传')
      this.uploader.stop()
    }, ()=>{
      stopBtn.html('暂停上传')
      this.uploader.upload()
    })
    //暂停上传

  }
  validataType(type){
    const opts = this.option
    type === 'Q_EXCEED_SIZE_LIMIT' && (this.Message.wain(`请上传${opts.fileSizeLimit}M大小的文件`))
    type === 'Q_TYPE_DENIED' && (this.Message.wain('请上传正确格式的文件'))
  }
  defaults(){
    return {
      stopBtn:undefined,
      chunked: true,
      server:'', //'http://localhost:3031/uploads',
      auto :true,
      extensions:'gif,jpg,jpeg,bmp,png',
      method:'POST',
      fileSizeLimit:50 *1024 *1024, //单位b = 500mb  //file.size 单位b
      mimeTypes: 'image/*',
      fileVal:'file',
      formData:{},
      uploadVideo:{
        shortvideoToken:'',
        uid:''
      },
      pick:{
        id:undefined,
        multiple:true
      },
      accept:{
      },
      beforeUploader(File){
        return true
      },
      uploadProgress(File, percentage){
        
      },
      uploaderError(){

      },
      uploadSuccess(File, response){

      }
    }
  }
}