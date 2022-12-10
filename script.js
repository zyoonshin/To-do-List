window.onload = () => {
    // forEach()를 이용하여 새로고침 했을 때마다 로직이 실행되어 local storage에서 데이터를 가져와서 파싱해줌
    tasks.forEach(item => item.state = "show");
    Task.display();
}

let tasks = [];
const getTasks = localStorage.getItem('tasks');

if (getTasks) tasks = JSON.parse(getTasks);

const input = document.getElementById('task'),
    createBtn = document.getElementById('create-task'),
    
    // search 기능 제거
    // search_btn = document.getElementById('search-task'),

    // 회오리 화살표 기능 제거
    // refresh = document.getElementById('refresh'),
    clear__all = document.querySelector('.clear__all');

class Task {
    // display tasks
    static display() {
        const tasks_container = document.getElementById('tasks');
        let _tasks = '';

        // local storage로부터 데이터를 가져옴
        tasks.forEach((task, index) => {
            _tasks += `                                         
                <div class="task-item ${task.state === "show" ? 'mt-2 d-flex justify-content-between align-items-center' : 'd-none'}">
                    <div class="task-name">
                        <p class="${task.completed === 'true' ? 'text-decoration-line-through' : 'text-dark'}" id="task__name">${task.name}</p>
                    </div>
                    <div class="action btns">
                        <button type="button" class="btn btn-sm btn-success is__completed" onclick="Task.todoCompleted('${task.id}')"><i class="fa-solid fa-circle-check"></i></button>
                        <button type="button" class="btn btn-sm btn-primary edit" onclick="Task.update('${task.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button type="button" class="btn btn-sm btn-danger delete" onclick="Task.delete('${task.id}')"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            `;
            // 휴지통 모양 버튼 ms-1 제거하니까 버튼 간 간격 일정해짐
            // fa-circle-check, fa-fen-to-square, fa-trash-can은 아이콘 모양
        });
        (tasks.length === 0 || _tasks === '') ? clear__all.classList.add('d-none') : clear__all.classList.remove('d-none');
        tasks_container.innerHTML = _tasks;

        // stringify 함수를 이용하여 local storage로 JSON 형식의 문자열로  데이터 넘겨줌
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // create task
    static create(task) {
        const generateRandomId = Math.floor(Math.random() * 99999);
        // 리스트 생성 시 리스트별로 랜덤한 숫자 할당해줌
        tasks.push({ id: generateRandomId, name: task, completed: 'false', state: 'show' });
        this.display();
    }

    // completed
    static todoCompleted(task) {
        tasks.forEach(item => {
            if (`${item.id}` === task) {
                if (item.completed === 'false')
                    item.completed = 'true';
                else
                    item.completed = 'false';
            }
        });

        this.display();
    }

    // update/edit task
    static update(task) {
        const taskItems = document.querySelectorAll('.task-item');
        const taskInput = document.getElementById('task-input');
        const edit = document.querySelectorAll('.task-name');

        tasks.forEach((item, index) => {
            if (`${item.id}` === task) {
                taskItems[index].classList.add('task-editing');
                edit[index].innerHTML = `
                    <input type="text" id="task-input" class="form-control" value="${item.name}" placeholder="Edit this Todo and Hit Enter!" title="Edit this Todo and Hit Enter!" />
                    <button type="button" class="btn btn-primary save-edited-todo">Edit This</button>
                `;
                // edit할 때 공란으로 두면 Edit this Todo and Hit Enter! 메세지 출력


                const taskInputs = document.querySelectorAll('#task-input');
                const saveEditTodo = document.querySelector('.save-edited-todo');
                if (taskInputs) {
                    taskInputs.forEach(input => {
                        input.addEventListener('keydown', e => {
                            if (e.key === 'Enter') {

                                // error 라 주석처리함 어떨 때 사용하는지 모르겠음
                                // if (input.value === '') showError('.error', 'Edit Field Cannot be Empty!');

                                // eventListenr를 이용하여 click시 발생할 이벤트를 설정한다.
                                saveEditTodo.addEventListener('click', e => {
                                    let input_value = input.value;
                                    if (input_value) this.update(task, input_value);
                                });

                                saveEditTodo.click();
                            }
                        });
                    });
                }

                if (taskInput.value === '') return;

                item.name = taskInput.value;
            }
        });

        this.display();
    }

    // delete task
    // 삭제 버튼을 누르는 이벤트를 함
    // 제거하고자 하는 리스트를 완전히 삭제해야 정확히 리스트를 한개 삭제함
    // local storage에서의 데이터도 업데이트 시켜야함
    // filter() 메소드를 이용하면 forEach() 메소드와 같이 배열의 모든 요소마다 특정 메소드 호출해줌
    // 만약 특정 메소드가 false이 아닌 true를 반환한 값들만 모아둔 배열을 만들어 반환
    // 타겟 노드는 바뀌지 않고 반환 ㄱ밧으로만 변환된 배열을 얻을 수 있으므로 item 변수 다시 받음
    static delete(task) {
        // filter() 메소드는 true, false이므로 => 을 이용하여 간단한 boolean형 조건문으로 대체함
        tasks = tasks.filter(item => `${item.id}` !== task);

        // tasks.forEach((item, index) => {
        //     if(`${item.id}` === task) {
        //         tasks.splice(index, 1)
        //     }
        // });
        this.display();
    }

    // search task
    // search 기능 제거
    // static search(task) {
    //     tasks = tasks.filter(item => item.name.toLowerCase() === task ? item.state = "show" : item.state = "hide");

    //     const checkTask = element => element.name.toLowerCase() === `${task.toString()}`;
    //     if (tasks.some(checkTask) === false) {
    //         showError('.error', 'Todo, Does not Exists!');
    //         return clear__all.classList.add('d-none');
    //     } else clear__all.classList.remove('d-none');

    //     this.display();
    // }
}

// Create Btn
// EventListner를 이용하여 리스트를 추가하는 이벤트를 설정한다.
createBtn.addEventListener('click', (e) => {
    const input_value = input.value;
    if (input_value !== '') {
        input.value = '';
        Task.create(input_value);
    }
    // Cannot Add Todo! 경고 제거
    // 빈칸에 엔터 시 나타남
    // } else {
    //     showError('.error', 'Cannot Add Todo!');
    // }
});

// Search Btn
// search 기능 제거
// search_btn.addEventListener('click', e => {
//     let task = input;
//     let search_value = input.value;

//     if (search_value != '') {
//         task.style.border = '1px solid gray';
//         input.value = '';
//         Task.search(search_value.toLowerCase());
//     }
    
    // Search Field Cannot be Empty! 경고 제거
    // -> 방향키 누르면 나타나는 경고 제거
    // else {
    //     showError('.error', 'Search Field Cannot be Empty!');
    //     task.style.border = '1px solid red';
    // }
// });

// Prevent from Submit-ing the Form
let form = document.querySelector('.form');
form.addEventListener('submit', e => {
    e.preventDefault();
});

// Keyboard Support Enter Key (To add a Task) and > Right Arrow (to Search)
// -> 키 누르면 경고 나타났던 이유
// 엔터 쳐도 리스트 추가

input.addEventListener('keydown', e => {
     if (e.key === 'Enter') createBtn.click();

//     if (e.key === 'ArrowRight') search_btn.click();
});

// Errors Function
// 경고 기능 해제
// function showError(error_place, error_message) {
//     const error_container = document.querySelector(error_place);
//     if (error_container) {
//         error_container.innerHTML = `
//             <div class="alert alert-danger error" role="alert">
//                 ${error_message}
//             </div>
//         `;
//         setTimeout(() => error_container.innerHTML = '', 3000);
//     }
// }

// Clear All Btn
function clearAll() {
    tasks = [];
    Task.display();
}

clear__all.addEventListener('click', clearAll);

// 회오리 화살표 기능 제거
// Refresh Page
// refresh.addEventListener('click', () => location.href = location.href);