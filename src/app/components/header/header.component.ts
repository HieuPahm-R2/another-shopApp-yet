import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, of, Subject, switchMap, takeUntil } from 'rxjs';
import { SearchBarService, Suggestion } from '../../services/search-bar.service';
import { environment } from '../../env/environments';
import { Router, RouterModule } from '@angular/router';
import { UserResponse } from '../../res/user.response';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  userResponse?: UserResponse | null
  isPopoverOpen = false
  activeNavItem: number = 0

  suggestions: Suggestion[] = [];
  selectedCategoryId: number = 0; // Giá trị category được chọn
  currentPage: number = 0;
  itemsPerPage: number = 10;
  pages: number[] = [];
  searchControl = new FormControl('');
  showSuggestions = false;

  @Output() search = new EventEmitter<string>();

  private destroy$ = new Subject<void>();

  constructor(private searchService: SearchBarService, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage()
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(keyword => {
          if (!keyword || keyword.trim() === '') {
            return of([])
          }
          return this.searchService.searchBook(keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage)
        }

        )
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(results => {
        results.forEach(suggestion => {
          suggestion.url = `${environment.apiBaseUrl}/products/images/${suggestion.image}`
        })
        this.suggestions = results
        this.showSuggestions = results.length > 0;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectSuggestion(suggestion: Suggestion) {
    this.searchControl.setValue(suggestion.title, { emitEvent: false });
    this.showSuggestions = false;
    this.search.emit(suggestion.title);
  }

  onSubmit() {
    this.search.emit(this.searchControl.value || '');
    this.showSuggestions = false;
  }

}
