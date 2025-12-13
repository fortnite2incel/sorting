from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import os
import json


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "sorting_history.db")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  #html обращается к api
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SortRequest(BaseModel):
    numbers: list[int]
    algorithm: str

def bubble_sort(arr):
    steps = [arr.copy()]
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                steps.append(arr.copy())

    return steps

def selection_sort(arr):
    steps = [arr.copy()]
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
        steps.append(arr.copy())
    return steps

def insertion_sort(arr):
    steps = [arr.copy()]
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
            steps.append(arr.copy())
        arr[j + 1] = key
        steps.append(arr.copy())
    return steps

def quick_sort_steps(arr):
    steps = []

    def _quick_sort(a, low, high):
        if low < high:
            pi = partition(a, low, high)
            steps.append(a.copy())
            _quick_sort(a, low, pi - 1)
            _quick_sort(a, pi + 1, high)

    def partition(a, low, high):
        pivot = a[high]
        i = low - 1
        for j in range(low, high):
            if a[j] < pivot:
                i += 1
                a[i], a[j] = a[j], a[i]
                steps.append(a.copy())
        a[i + 1], a[high] = a[high], a[i + 1]
        return i + 1

    steps.append(arr.copy())
    _quick_sort(arr, 0, len(arr) - 1)
    return steps

@app.post("/sort")
def sort_array(data: SortRequest):
    arr = data.numbers.copy()

    if data.algorithm == "bubble":
        steps = bubble_sort(arr)
    elif data.algorithm == "selection":
        steps = selection_sort(arr)
    elif data.algorithm == "insertion":
        steps = insertion_sort(arr)
    elif data.algorithm == "quick":
        steps = quick_sort_steps(arr)
    else:
        return {"error": "Unknown algorithm"}

    save_history(
        json.dumps(data.numbers),   # original array
        data.algorithm,             # algorithm name
        json.dumps(steps[-1])       # final sorted result
    )

    return {"steps": steps}

@app.on_event("startup")
def startup_event():
    init_db()


def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numbers TEXT,
        algorithm TEXT,
        result TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()


