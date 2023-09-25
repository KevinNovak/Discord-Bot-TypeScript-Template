import pad from 'pad';

interface TableBuilderOptions<T> {
  sortBy?: (keyof T)[];
  sortDirection?: 'asc' | 'desc';
}

const defaultOptions: TableBuilderOptions<any> = {
  sortDirection: 'asc',
};

interface IColumn<T> {
  index: number;
  label: string;
  width: number;
  field: keyof T;
  format?: (content) => string;
}

export class TableBuilder<T> {
  private readonly _columns: IColumn<T>[];
  private readonly _items: T[];
  private readonly _options: TableBuilderOptions<T>;

  constructor(columns?: IColumn<T>[], options?: TableBuilderOptions<T>) {
    this._columns = [TableBuilder._createIndexColumn()];
    if (columns) {
      this._columns.push(...columns);
    }

    this._items = [];

    // Merge default with given options
    this._options = options ? Object.assign({}, defaultOptions, options) : defaultOptions;
  }

  addRows(...rows: T[]): void {
    rows.forEach((row) => this._items.push(row));
  }

  build(): string {
    // Header

    let result = `\`${this._buildRow(this._createHeader())}\n`;
    result += pad('', this._totalWidth(), '―');

    // Content

    if (this._options.sortBy) {
      this._sortRows();
    }

    this._items.forEach((row, index) => {
      result += `\n${this._buildRow(row, index + 1)}`;
    });

    return `${result}\``;
  }

  private _buildRow(data: T, index?: number): string {
    const keys = Object.keys(data).filter((key) => this._columns.find((col) => col.field === key));

    keys.sort((keyA, keyB) => {
      const colA = this._columns.find((col) => col.field === keyA);
      const colB = this._columns.find((col) => col.field === keyB);
      return colA.index - colB.index;
    });

    let result = index ? pad(String(index), TableBuilder._createIndexColumn().width) : '';
    keys.forEach((key) => {
      const column = this._columns.find((col) => col.field === key);

      let content = data[key];
      if (column.format && index) {
        content = column.format(data[key]);
      }

      result += pad(String(content), column.width);
    });

    return result;
  }

  private _createHeader(): T {
    const header: any = {};

    this._columns.forEach((col) => {
      header[col.field] = col.label;
    });

    return header;
  }

  private _totalWidth(): number {
    let width = 0;
    this._columns.forEach((col) => (width += col.width));
    return width;
  }

  private _sortRows(): void {
    this._items.sort((a, b) => {
      let diff = 0;

      // Go through each of the sortBy columns, ordered in descending priority
      for (const columnField of this._options.sortBy) {
        const field = this._columns.find((col) => col.field === columnField).field;
        diff = this._compareValues(a[field], b[field]);

        // Only continue if the cells are equal in the current column
        if (diff !== 0) {
          break;
        }
      }

      return diff;
    });
  }

  private _compareValues(a: any, b: any): number {
    // Find the label of the column to sort by
    if (this._options.sortDirection === 'desc') {
      [a, b] = [b, a];
    }

    if (typeof a === 'string') {
      return a.localeCompare(b);
    } else if (typeof a === 'number') {
      return a - b;
    } else if (a instanceof Date) {
      return a.getTime() - b.getTime();
    }
  }

  private static _createIndexColumn(): IColumn<any> {
    return {
      index: 0,
      label: '#',
      width: 4,
      field: '#',
    };
  }
}