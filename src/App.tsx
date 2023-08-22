import React, { useMemo, useState } from "react";
import "./App.css";

import {
  Button,
  Card,
  CardContent,
  Container,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import tasks, { Task } from "./constants/tasks";
import TodoItem from "./components/TodoItem";

type Todo = { task: Task; timer: NodeJS.Timeout };

const TODO_TIMEOUT = 5000;

function App() {
  const [backlogs, setBacklogs] = useState<Task[]>(tasks);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoName, setNewTodoName] = useState("");
  const [isShowAlert, setIsShowAlert] = useState(false);

  const fruitTodos = useMemo(
    () => todos.filter(({ task }) => task.type === "Fruit"),
    [todos],
  );

  const vegetableTodos = useMemo(
    () => todos.filter(({ task }) => task.type === "Vegetable"),
    [todos],
  );

  const getTaskFromName = (name: string): Task | undefined =>
    tasks.find((task) => task.name.toLowerCase() === name.toLowerCase());

  const getTodoFromName = (name: string): Todo | undefined =>
    todos.find((todo) => todo.task.name === name);

  const removeFromTodo = (item: Todo) => {
    // clear schedule every time remove todo
    clearTimeout(item.timer);

    setTodos((prev) => prev.filter(({ task }) => task.name !== item.task.name));
    setBacklogs((prev) => [...prev, item.task]);
  };

  const addToTodo = (task: Task) => {
    // set a schedule for removing todo before adding todo
    const timer = setTimeout(() => {
      removeFromTodo({ task, timer });
    }, TODO_TIMEOUT);

    setTodos((prev) => [...prev, { task, timer }]);
    setBacklogs((prev) => prev.filter(({ name }) => name !== task.name));
  };

  const handleAddTodo = () => {
    const task = getTaskFromName(newTodoName);

    // first scenario if the entered name does not match the list, show an error
    if (!task) {
      setIsShowAlert(true);
      return;
    }

    const todo = getTodoFromName(task.name);

    // second scenario, if the name entered not exists in the backlog,
    // add it to the backlog and remove it from todo list
    if (todo) {
      removeFromTodo(todo);
      return;
    }

    // last scenario, if the name entered already exists in the backlog,
    // add it to todo list and remove it from backlog
    addToTodo(task);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h2" gutterBottom>
        Todo List
      </Typography>

      <Stack direction="row" spacing={2}>
        <Stack spacing={2} sx={{ width: 150 }}>
          {backlogs.map((backlog) => (
            <TodoItem key={backlog.name}>{backlog.name}</TodoItem>
          ))}
        </Stack>

        <Stack sx={{ flex: 1 }} spacing={2}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Fill out the to-do item here"
              variant="outlined"
              sx={{ flex: 1 }}
              onChange={(e) => setNewTodoName(e.target.value)}
              defaultValue={newTodoName}
            />
            <Button variant="contained" onClick={handleAddTodo}>
              Enter
            </Button>
          </Stack>

          <Stack direction="row" spacing={2}>
            {[
              { title: "Fruits", list: fruitTodos },
              { title: "Vegetables", list: vegetableTodos },
            ].map(({ title, list }) => (
              <Card key={title} sx={{ flex: 1, minHeight: 300 }}>
                <CardContent>
                  <Typography gutterBottom variant="h5">
                    {title}
                  </Typography>
                  <Stack spacing={2}>
                    {list.map(({ task }) => (
                      <TodoItem key={task.name}>{task.name}</TodoItem>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Stack>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={isShowAlert}
        onClose={() => setIsShowAlert(false)}
        message="Please enter the specified type of todo only"
      />
    </Container>
  );
}

export default App;
