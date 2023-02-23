import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class URLService {


  public baseURL = "";
  public cloudBaseURL = "";
  public studentInfo = "api/student_info";
  public hallTicketVerification = "api/conduct_exam/student_login";
  public examDetails = "api/student_exam_info";


  //Controller verification
  public checkValidControllerURL = "api/exam/session_verification";

  //Controller login
  public controllerLoginURL = "api/exam/invigilator_login";
  public controllerOTPVerificationURL = "api/exam/invigilator_otp_verification";
  public recaptchaVerificationURL = "api/exam/reCaptcha_verify";

  //Controller Exam Fetch
  public examFetchFormCloudServerURL = "api/conduct_exam/exam_fetch";
  //Controller student fetch
  public examStudentFetchURL = "api/conduct_exam/student_data_fetch";

  public studentFaceRecognitionURL = "api/conduct_exam/face_recognition";

  public singleStudentVerifyURL = "api/conduct_exam/student_verification";

  public submitAllExamsURL = "api/conduct_exam/exam_verification";

  public examVerifiedStudentFetchURL = "api/conduct_exam/verified_student_list";

  public invigilatorStartExamURL = "api/conduct_exam/invigilator_start_exam";

  public individualStudentTimePauseURL = "api/conduct_exam/invigilator_time_pause";

  public individualStudentTimeResumeURL = "api/conduct_exam/invigilator_time_resume";

  public fetchReservedSystemsURL = "api/conduct_exam/fetch_res_systems";

  public individualStudentSystemChangeURL = "api/conduct_exam/stud_system_change";

  public invigilatorExamSubmitURL = "api/conduct_exam/invigilator_exam_submit";

  public individualStudentSMPListURL = "api/conduct_exam/smp_student_list";

  public individualStudentSMPBlockURL = "api/conduct_exam/student_exam_block";

  public individualStudentSMPAllowURL = "api/conduct_exam/exam_allow";

  public lateComerTimeConfigURL = "api/conduct_exam/late_comers_student_list";

  public examSummaryURL = "api/conduct_exam/exam_summary";

  public checkIfAllStudentsExamCompletedURL = "api/conduct_exam/verified_stud_exam_check";

  public invigilatorStudentExamSummaryURL = "api/conduct_exam/student_exam_summary";

public invigilatorStudentEarlyExamSubmitURL = "api/conduct_exam/early_submission_verification";

 public studentRandomImageUrl="api/conduct_exam/student_audit_image_fetch";
  //Student 
  public checkValidStudentURL = "api/conduct_exam/session_verification";

  public studentStartExamURL = "api/conduct_exam/student_start_exam";

  public questionFetchURL = "api/conduct_exam/student_question_fetch";

  public checkExamStartsURL = "api/conduct_exam/exam_status_check";

  public markStudentSMPURL = "api/conduct_exam/smp_mark";

  public UnlockStudentSMPURL = "api/conduct_exam/smp_otp_verification";

  public StudentResponseSubmitURL = "api/conduct_exam/student_response_submission";

  public studentExamSubmitURL = "api/conduct_exam/student_exam_submission";

  public studentExamSummaryURL = "api/conduct_exam/student_response_fetch";
  public answersheetUploadURL = "api/conduct_exam/answersheet_upload";

  public checkSMPURL = "api/conduct_exam/student_smp_check";

  public studentEarlySubmitRequestURL = "api/conduct_exam/early_submission_request";

  public checkStudentEarlyExamSubmitStatusURL = "api/conduct_exam/early_submission_status_check";

  public randomImageCaptureURL="api/conduct_exam/random-image-capture";

  public SMPCodeFetchURL = "api/conduct_exam/student_smp_code_fetch";

  public studentStatusVerification = "api/conduct_exam/student_verification_status_fetch";

  public headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });

  constructor(private http: HttpClient) {
    this.setBaseURL();
    this.url.subscribe(response => {
      if (response) {
        this.baseURL = response["URL"];
        this.cloudBaseURL = response["CLOUD_URL"];
      }
      else {
        console.log("Unable to set Base URL");
      }
    })
  }
  private url = new BehaviorSubject<object>(null);

  setBaseURL(): any {
    return this.http.get('../../assets/json/baseURL.json').subscribe(
      data => {
        this.url.next(data);
      },
      error => {
        console.log(error);

        console.log("Base URL error");
      }
    );
  }

}
