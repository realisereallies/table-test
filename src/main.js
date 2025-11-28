import "./style/style.scss";

const coursesData = [
  {
    id: 1,
    category: "Marketing",
    title: "The Ultimate Google Ads Training Course",
    price: "$100",
    instructor: "by Jerome Bell",
    image: "/bell.jpg",
  },
  {
    id: 2,
    category: "Management",
    title: "Product Management Fundamentals",
    price: "$480",
    instructor: "by Marvin McKinney",
    image: "/mckinney.jpg",
  },
  {
    id: 3,
    category: "HR & Recruiting",
    title: "HR  Management and Analytics",
    price: "$200",
    instructor: "by Leslie Alexander Li",
    image: "/li.jpg",
  },
  {
    id: 4,
    category: "Marketing",
    title: "Brand Management & PR Communications",
    price: "$530",
    instructor: "by Kristin Watson",
    image: "/watson.jpg",
  },
  {
    id: 5,
    category: "Design",
    title: "Graphic Design Basic",
    price: "$500",
    instructor: "by Guy Hawkins",
    image: "/hawkins.jpg",
  },
  {
    id: 6,
    category: "Management",
    title: "Business Development Management",
    price: "$400",
    instructor: "by Dianne Russell",
    image: "/russel.jpg",
  },
  {
    id: 7,
    category: "Development",
    title: "Highload Software Architecture",
    price: "$600",
    instructor: "by Brooklyn Simmons",
    image: "/simmons.jpg",
  },
  {
    id: 8,
    category: "HR & Recruiting",
    title: "Human Resources – Selection and Recruitment",
    price: "$150",
    instructor: "by Kathryn Murphy",
    image: "/myrphy.jpg",
  },
  {
    id: 9,
    category: "Design",
    title: "User Experience. Human-centered Design",
    price: "$240",
    instructor: "by Cody Fisher",
    image: "/fisher.jpg",
  },
  {
    id: 10,
    category: "Marketing",
    title: "Social Media Marketing Strategy",
    price: "$105",
    instructor: "Emily Watson",
    image: "/hawkins.jpg",
  },
  {
    id: 11,
    category: "Management",
    title: "Strategic Leadership and Planning",
    price: "$125",
    instructor: "Michael Chen",
    image: "/bell.jpg",
  },
  {
    id: 12,
    category: "HR & Recruiting",
    title: "Employee Onboarding Best Practices",
    price: "$88",
    instructor: "Sarah Johnson",
    image: "/watson.jpg",
  },
  {
    id: 13,
    category: "HR & Recruiting",
    title: "Performance Management Systems",
    price: "$92",
    instructor: "David Brown",
    image: "/fisher.jpg",
  },
  {
    id: 14,
    category: "HR & Recruiting",
    title: "Workplace Diversity and Inclusion",
    price: "$87",
    instructor: "Lisa Anderson",
    image: "/russel.jpg",
  },
  {
    id: 15,
    category: "Design",
    title: "UI/UX Design Principles",
    price: "$95",
    instructor: "James Wilson",
    image: "/mckinney.jpg",
  },
  {
    id: 16,
    category: "Development",
    title: "Full Stack Web Development",
    price: "$140",
    instructor: "Maria Garcia",
    image: "/li.jpg",
  },
  {
    id: 17,
    category: "Development",
    title: "Mobile App Development",
    price: "$135",
    instructor: "Thomas Lee",
    image: "/simmons.jpg",
  },
];

let displayedCount = 9;
let currentCategory = "All";
let searchQuery = "";
let searchTimeout = null;

function getCategoryClass(category) {
  const categoryMap = {
    "Marketing": "marketing",
    "Management": "management",
    "HR & Recruiting": "hr-recruiting",
    "Design": "design",
    "Development": "development"
  };
  return categoryMap[category] || category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function getCategoriesFromCourses(courses) {
  const categoryCounts = {};

  courses.forEach((course) => {
    const category = course.category;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const categoryOrder = [
    "Marketing",
    "Management",
    "HR & Recruiting",
    "Design",
    "Development",
  ];

  const categories = categoryOrder
    .filter((name) => categoryCounts[name])
    .map((name) => ({ name, count: categoryCounts[name] }));

  return [{ name: "All", count: courses.length, active: true }, ...categories];
}

function getFilteredCourses(courses, category, search) {
  let filtered = courses;

  if (category !== "All") {
    filtered = filtered.filter((course) => course.category === category);
  }

  if (search) {
    const query = search.toLowerCase();
    filtered = filtered.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query)
    );
  }

  return filtered;
}

function renderFilters() {
  const categories = getCategoriesFromCourses(coursesData);
  const filtersContainer = document.querySelector("#category-filters");

  if (filtersContainer) {
    filtersContainer.innerHTML = categories
      .map(
        (cat) => `
        <button class="filter-btn ${
          currentCategory === cat.name ? "filter-btn--active" : ""
        }" data-category="${cat.name}">
          ${cat.name}<sup class="filter-btn__count">${cat.count}</sup>
        </button>
      `
      )
      .join("");
  }
}

function renderCourses() {
  const filteredCourses = getFilteredCourses(
    coursesData,
    currentCategory,
    searchQuery
  );
  const coursesToShow = filteredCourses.slice(0, displayedCount);
  const hasMore = filteredCourses.length > displayedCount;
  const coursesGrid = document.querySelector("#courses-grid");
  const loadMoreWrapper = document.querySelector("#load-more-wrapper");

  if (coursesGrid) {
    coursesGrid.innerHTML = coursesToShow
      .map(
        (course) => `
        <article class="course-card">
          <div class="course-card__image">
            <img src="${course.image}" alt="${course.title}" />
          </div>
          <div class="course-card__content">
            <span class="course-card__category course-card__category--${getCategoryClass(course.category)}">${course.category}</span>
            <h2 class="course-card__title">${course.title}</h2>
            <div class="course-card__footer">
              <span class="course-card__price">${course.price}</span>
              <span class="course-card__instructor"> ${course.instructor}</span>
            </div>
          </div>
        </article>
      `
      )
      .join("");
  }

  if (loadMoreWrapper) {
    if (hasMore) {
      loadMoreWrapper.classList.add("courses__load-more-wrapper--visible");
    } else {
      loadMoreWrapper.classList.remove("courses__load-more-wrapper--visible");
    }
  }

  attachEventListeners();
}

function attachEventListeners() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((btn) => {
    btn.replaceWith(btn.cloneNode(true));
  });

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCategory = btn.dataset.category;
      displayedCount = 9;
      renderFilters();
      renderCourses();
    });
  });

  const loadMoreBtn = document.querySelector("#load-more-btn");
  if (loadMoreBtn) {
    loadMoreBtn.replaceWith(loadMoreBtn.cloneNode(true));
    document.querySelector("#load-more-btn").addEventListener("click", () => {
      displayedCount += 9;
      renderCourses();
    });
  }
}

function initSearch() {
  const searchInput = document.querySelector("#search-input");
  if (searchInput) {
    searchInput.value = searchQuery;
    searchInput.addEventListener("input", (e) => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      
      searchTimeout = setTimeout(() => {
        searchQuery = e.target.value;
        displayedCount = 9;
        renderCourses();
      }, 300);
    });
  }
}

renderFilters();
renderCourses();
initSearch();
