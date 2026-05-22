import { FilterDropdown } from '../molecules/FilterDropdown'
import { BRANCHES } from '../../lib/constants'

interface AppHeaderProps {
  selectedBranch: string
  onBranchChange: (branch: string) => void
}

export function AppHeader({ selectedBranch, onBranchChange }: AppHeaderProps) {
  const branchOptions = BRANCHES.map(b => ({ label: b, value: b }))

  return (
    <header className='bg-primary px-6 py-4 flex items-center justify-between shadow-md'>
      <div>
        <h1 className='text-[26px] font-bold text-white'>Halcyon</h1>
        <p className='text-xs font-normal text-neutral'>SENTINEL Onboarding</p>
      </div>

      <div className='w-48'>
        <FilterDropdown
          label='Branches'
          value={selectedBranch}
          options={branchOptions}
          onChange={onBranchChange}
        />
      </div>
    </header>
  )
}
