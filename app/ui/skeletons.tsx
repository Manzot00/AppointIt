// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}
    >
      <div className="flex p-4">
        <div className="h-5 w-5 rounded-md bg-gray-200" />
        <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}

export function CalendarSkeleton() {
  return (
    <div className={`${shimmer} w-full md:w-1/2 h-[550px] mb-4 md:mb-0`}>
      <div className="mb-4 text-xl md:text-2xl bg-gray-100 h-8 w-1/3 rounded-md"></div>
      <div className="h-full bg-gray-100 rounded-md"></div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className={`${shimmer} w-full md:w-1/2 h-[550px] mb-4 md:mb-0 overflow-y-auto order-first md:order-none`}>
      <div className="mb-4 text-xl md:text-2xl bg-gray-100 h-8 w-1/3 rounded-md"></div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-300 text-gray-400 text-center border-r border-gray-200">Date</th>
            <th className="py-2 px-4 bg-gray-300 text-gray-400 text-center">Earnings</th>
          </tr>
        </thead>
        <tbody>
          {Array(5).fill(0).map((_, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-t border-r border-gray-200 bg-gray-100"></td>
              <td className="py-2 px-4 border-t border-gray-200 bg-gray-100"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function HomeSkeleton() {
  return (
    <>
      <div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <CardsSkeleton />
        </div>
        <div className="mt-6 flex flex-col md:flex-row md:space-x-4">
          <CalendarSkeleton />
          <TableSkeleton />
        </div>
      </div>
    </>
  );
}

export function EditCustomerFormSkeleton() {
  return (
    <div className={`${shimmer} p-6 bg-white rounded-lg shadow-md`}>
      <div className="grid gap-4">
        <div className="h-5 w-20 bg-gray-200 rounded-md mb-2"></div>
        <div className="h-10 bg-gray-200 rounded-md mb-4"></div>
        
        <div className="h-5 w-20 bg-gray-200 rounded-md mb-2"></div>
        <div className="h-10 bg-gray-200 rounded-md mb-4"></div>

        <div className="h-5 w-20 bg-gray-200 rounded-md mb-2"></div>
        <div className="h-10 bg-gray-200 rounded-md mb-4"></div>

        <div className="h-5 w-20 bg-gray-200 rounded-md mb-2"></div>
        <div className="h-10 bg-gray-200 rounded-md mb-4"></div>

        <div className="flex justify-between mt-4">
          <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
          <div className="h-10 w-24 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
