import { SearchIcon } from "lucide-react"
import { InputGroupAddon, InputGroupButton,InputGroupInput, InputGroup } from "./ui/input-group"

type searchInputProps = {
    placeholder: string,
    text: string
}
export const SearchInput = ({placeholder, text}: searchInputProps) => {
  return (
    <div className="w-full">
          <div className='flex w-full max-w-sm items-center gap-2'>
              <InputGroup className="bg-white focus:outline-0">
                  <InputGroupInput placeholder={placeholder}
                  />
                  <InputGroupAddon>
                      <SearchIcon />
                  </InputGroupAddon>
              </InputGroup>
              <InputGroupAddon align='inline-end'>
                  <InputGroupButton type="button" variant='outline' className="text-sm border border-[#E2E8F0] bg-[#10B981] text-white cursor-pointer py-4 px-2">
                    {text}
                  </InputGroupButton>
              </InputGroupAddon>
          </div>
    </div>
  )
}
