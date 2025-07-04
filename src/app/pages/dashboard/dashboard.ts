import { Component, inject } from '@angular/core';
import { Select } from '../../shared/components/select/select';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Category } from '../../shared/services/category';
import { InputComponent } from '../../shared/components/input/input';

@Component({
  selector: 'app-dashboard',
  imports: [Select, ReactiveFormsModule, InputComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  form!: FormGroup;
  private formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      bulk_data: ['', [Validators.required]],
      category: ['', [Validators.required]],
      file_name: ['', [Validators.required]],
    });
  }

  public get category(): FormControl {
    return this.form.get('category') as FormControl;
  }
  public get bulk_data(): FormControl {
    return this.form.get('bulk_data') as FormControl;
  }

  onFileSelected(files: any) {
    // this.isExtracting = true;
    // try {
    //   const selectedFile = files[0];
    //   const reader = new FileReader();
    //   reader.onload = (e: any) => {
    //     const data = new Uint8Array(e.target.result);
    //     const workbook = XLSX.read(data, { type: 'array' });
    //     /* DO SOMETHING WITH workbook HERE */
    //     const first_sheet_name = workbook.SheetNames[0];
    //     /* Get worksheet */
    //     const worksheet = workbook.Sheets[first_sheet_name];
    //     const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
    //     this.htmlWorkbookJSON = jsonData.map((element: Object) => {
    //       let entriesArray = Object.entries(element);
    //       const data = new Object();
    //       entriesArray.forEach(([key, value]) => {
    //         data[key.toLocaleLowerCase()] = value;
    //       });
    //       return data;
    //     });
    //     this.filename.patchValue(selectedFile.name);
    //     this.filename.updateValueAndValidity();
    //     this.bulkData.patchValue(this.htmlWorkbookJSON);
    //     this.bulkData.updateValueAndValidity();
    //     this.isExtracting = false;
    //   };
    //   reader.readAsArrayBuffer(selectedFile);
    // } catch (error) {
    //   this.isExtracting = false;
    // }
  }

  onUpload() {
    // const user = this.mwangaService.getUserInfo().user_id;
    // this.isLoading = true;
    // // create file, patch new fields, update
    // const file = {
    //   data_count: this.bulkData.value.length,
    //   name: this.filename.value,
    //   category: this.selectedCategory.id,
    //   created_by: user,
    // };
    // try {
    //   this.mwangaService.createFile(file).subscribe(
    //     (response: any) => {
    //       // console.log(response)
    //       const payload = this.bulkData.value.map((element) => {
    //         return {
    //           ...element,
    //           file_data: response.id,
    //           category: this.selectedCategory.id,
    //           created_by: user,
    //         };
    //       });
    //       this.mwangaService
    //         .uploadDataMod(payload, this.selectedCategory)
    //         .subscribe(
    //           (uploadresponse) => {
    //             const data = {
    //               category: this.selectedCategory.slug,
    //               counts: this.bulkData.value.length,
    //               file_name: this.filename.value,
    //             };
    //             this.mwangaService.updateRecord(data).subscribe((res) => {
    //               this.mwangaService.onShowSuccessdialog(`${this.bulkData.value.length} entries uploaded successfully`);
    //               this.form.reset();
    //               this.form.updateValueAndValidity();
    //               this.isLoading = false;
    //             }, (error) => {
    //               this.mwangaService.onShowFaildialog(error.error.message);
    //               this.isLoading = false;
    //             });
    //           },
    //           (error) => {
    //             this.mwangaService.onShowFaildialog(error.error.message);
    //             this.isLoading = false;
    //           }
    //         );
    //     },
    //     (error) => {
    //       this.mwangaService.onShowFaildialog(error.error.message);
    //       this.isLoading = false;
    //     }
    //   );
    // } catch (err) {
    //   this.mwangaService.onShowFaildialog(err.error.message);
    //   this.isLoading = false;
    // }
  }
}
